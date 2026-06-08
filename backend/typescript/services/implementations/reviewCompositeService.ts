import { Op, Order, OrderItem, col } from "sequelize";
import Applicant from "../../models/applicant.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import ReviewedApplicantRecord from "../../models/reviewedApplicantRecord.model";
import User from "../../models/user.model";
import {
  CreateReviewedApplicantRecordDTO,
  ReviewDashboardRowDTO,
  ReviewDashboardSidePanelDTO,
  ReviewDashboardSortBy,
  ReviewedApplicantRecordDTO,
  ReviewedApplicantsDTO,
  ReviewStatusEnum,
  SortDirection,
} from "../../types";
import {
  toReviewDashboardRowDTO,
  toReviewDashboardSidePanelDTO,
  toReviewedApplicantDTO,
} from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IReviewCompositeService from "../interfaces/IReviewCompositeService";
import ReviewedApplicantRecordService from "./reviewedApplicantRecordService";

const Logger = logger(__filename);

const reviewedApplicantRecordService = new ReviewedApplicantRecordService();

class ReviewCompositeService implements IReviewCompositeService {
  /* eslint-disable class-methods-use-this */

  async getReviewedApplicantsByUserId(
    userId: string,
  ): Promise<ReviewedApplicantsDTO[]> {
    try {
      const reviewedApplicants = await ReviewedApplicantRecord.findAll({
        where: { reviewer_id: Number(userId) },
        include: [
          {
            model: ApplicantRecord,
            include: [
              {
                model: Applicant,
                attributes: ["id", "first_name", "last_name"],
              },
            ],
          },
        ],
        attributes: ["applicant_record_id", "status"],
      });
      return reviewedApplicants.map(toReviewedApplicantDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get reviewed applicants by user id. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getReviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
    sortBy?: ReviewDashboardSortBy,
    sortDirection?: SortDirection,
  ): Promise<ReviewDashboardRowDTO[]> {
    try {
      const perPage = Number.isFinite(Number(resultsPerPage))
        ? Number(resultsPerPage)
        : 1;
      const currentPage = Number.isFinite(Number(pageNumber))
        ? Number(pageNumber)
        : 1;
      const offsetRow = (currentPage - 1) * perPage;

      const direction = sortDirection ?? "ASC";

      // separate: true runs the hasMany as a second query, so the main query is a
      // plain BelongsTo join — Sequelize won't wrap it in a subquery, which lets
      // ORDER BY reference the "applicant" table directly.
      const includeConfig = {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            attributes: { exclude: ["updatedAt"] },
            model: ReviewedApplicantRecord,
            separate: true,
            order: [
              ["createdAt", "ASC"],
              ["reviewer_id", "ASC"],
            ] as Order,
            include: [
              {
                attributes: { exclude: ["createdAt", "updatedAt"] },
                model: User,
              },
            ],
          },
          {
            attributes: { exclude: ["createdAt", "updatedAt"] },
            model: Applicant,
          },
        ],
      };

      // Reviewer-N sort: fetch all records, sort by the Nth reviewer's name in
      // the app layer, then paginate manually. "Reviewer 1" = the first reviewer
      // assigned (inner query is ordered by createdAt ASC above); "reviewer 2"
      // = the second-assigned reviewer, missing for rows with <2 reviewers.
      if (sortBy === "REVIEWER_1" || sortBy === "REVIEWER_2") {
        const idx = sortBy === "REVIEWER_1" ? 0 : 1;
        const all = await ApplicantRecord.findAll(includeConfig);
        const sorted = all.map(toReviewDashboardRowDTO).sort((a, b) => {
          const cmp =
            (a.reviewers[idx]?.firstName ?? "").localeCompare(
              b.reviewers[idx]?.firstName ?? "",
            ) ||
            (a.reviewers[idx]?.lastName ?? "").localeCompare(
              b.reviewers[idx]?.lastName ?? "",
            );
          return direction === "ASC" ? cmp : -cmp;
        });
        return sorted.slice(offsetRow, offsetRow + perPage);
      }

      const sortColumnMap: Record<
        Exclude<ReviewDashboardSortBy, "REVIEWER_1" | "REVIEWER_2">,
        OrderItem
      > = {
        FIRST_NAME: [col("applicant.first_name"), direction],
        LAST_NAME: [col("applicant.last_name"), direction],
        TIMES_APPLIED: [col("applicant.times_applied"), direction],
        CHOICE: ["choice", direction],
        TOTAL_SCORE: ["combined_review_score", direction],
        APPLICATION_STATUS: ["status", direction],
      };

      const order: Order = sortBy ? [sortColumnMap[sortBy]] : [["id", "ASC"]];

      // get applicant_record
      // JOIN applicant ON applicant_id
      // JOIN reviewed_applicant_record ON applicant_record_id
      // JOIN user ON reviewer_id
      const applicantRecords = await ApplicantRecord.findAll({
        ...includeConfig,
        order,
        limit: perPage,
        offset: offsetRow,
      });
      return applicantRecords.map(toReviewDashboardRowDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get dashboard. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getReviewDashboardSidePanel(
    applicantRecordId: string,
  ): Promise<ReviewDashboardSidePanelDTO> {
    try {
      const applicantRecord = await ApplicantRecord.findByPk(
        applicantRecordId,
        {
          include: [
            {
              model: Applicant,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      );
      if (!applicantRecord) {
        throw new Error(
          `ApplicantRecord with ID ${applicantRecordId} not found`,
        );
      }
      const reviewedApplicantRecords = await ReviewedApplicantRecord.findAll({
        where: { applicant_record_id: applicantRecordId },
        include: [
          {
            model: User,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: ["applicant_record_id", "reviewer_id", "status", "review"],
      });

      return toReviewDashboardSidePanelDTO(
        applicantRecord,
        reviewedApplicantRecords,
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to get review dashboard side panel for applicant record ${applicantRecordId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async delegateReviewers(
    positions: string[],
  ): Promise<ReviewedApplicantRecordDTO[]> {
    // NOTE: We do not have to concern ourselves with locality. That is, each user can be
    //       assigned to the same partner every time.

    const delegations = Array<CreateReviewedApplicantRecordDTO>();
    // maps (applicant_record_id) => pair of user_ids assigned to it

    // STEP 1:
    //   Populate the FSM
    //   NOTE: need to add a sentinel value at the end of the list if the number of user is odd.
    //         The last 'real' user will bear the burden of solo reviewing.

    // Get users and group by position
    const groups = (
      await User.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { position: { [Op.in]: positions } },
      })
    ).reduce((map, user) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const pos = user.position!;
      const arr = map.get(pos) ?? [];
      arr.push(user.id);
      map.set(pos, arr);
      return map;
    }, new Map<string, number[]>());

    // Build FSM
    // maps (position title) => (current index of list, list of users with position_title)
    const FSM = new Map<string, [number, (number | undefined)[]]>(
      positions.map((title) => [title, [0, groups.get(title) ?? []]]),
    );

    // Validate FSM for correctness
    Array.from(FSM.entries()).forEach(([title, [, userIds]]) => {
      if (userIds.length === 0) {
        // no users with this position
        throw new Error(`Invalid amount of users with position ${title}.`);
      }
      if (userIds.length % 2 !== 0) {
        // sentinel value of undefined at the end
        userIds.push(undefined);
      }
    });

    // STEP 2:
    //   Round robin with the FSM
    /*
    for (auto& a : applicant_records) {
      pair<int,vector<string>>& position_entry = FSM[a.position];

      // get first user
      string id1 = position_entry.second[position_entry.first];
      position_entry.first++;
      position_entry.first %= position_entry.second.size();

      // get second user
      string id2 = position_entry.second[position_entry.first];
      position_entry.first++;
      position_entry.first %= position_entry.second.size();

      delegations[a.id] = make_pair(id1, id2);
    }
     */
    const applicantRecords = await ApplicantRecord.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { position: { [Op.in]: positions } },
    });
    applicantRecords.forEach((record) => {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const [count, userIds] = FSM.get(record.position)!;
      let newCount = count;
      const assignedReviewer1 = FSM.get(record.position)![1][newCount];
      newCount += 1;
      newCount %= FSM.get(record.position)![1].length;
      const assignedReviewer2 = FSM.get(record.position)![1][newCount];
      newCount += 1;
      newCount %= FSM.get(record.position)![1].length;
      FSM.set(record.position, [newCount, userIds]);

      if (assignedReviewer1 !== undefined) {
        delegations.push({
          applicantRecordId: record.id,
          reviewerId: assignedReviewer1.toString(),
          status: ReviewStatusEnum.TODO,
        });
      }

      if (assignedReviewer2 !== undefined) {
        delegations.push({
          applicantRecordId: record.id,
          reviewerId: assignedReviewer2.toString(),
          status: ReviewStatusEnum.TODO,
        });
      }
    });

    // STEP 3:
    //   Batch the delegations into ReviewedApplicantRecords
    //   NOTE: do not add the sentinel value we inserted earlier.
    return reviewedApplicantRecordService.bulkCreateReviewedApplicantRecord(
      delegations,
    );
  }
}

export default ReviewCompositeService;
