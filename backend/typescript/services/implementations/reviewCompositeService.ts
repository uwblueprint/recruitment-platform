import { Op, Order, OrderItem, col, literal } from "sequelize";
import Applicant from "../../models/applicant.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import ReviewedApplicantRecord from "../../models/reviewedApplicantRecord.model";
import User from "../../models/user.model";
import {
  ApplicantRecordWithReviewersDTO,
  CreateReviewedApplicantRecordDTO,
  ReviewDashboardRowDTO,
  ReviewDashboardSidePanelDTO,
  ReviewDashboardSortBy,
  ReviewDashboardSortByEnum,
  ReviewedApplicantRecordDTO,
  ReviewedApplicantsDTO,
  ReviewStatusEnum,
} from "../../types";
import {
  toApplicantRecordDTO,
  toReviewDashboardRowDTO,
  toReviewDashboardSidePanelDTO,
  toReviewedApplicantDTO,
  toReviewedApplicantRecordWithReviewerDTO,
} from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IReviewCompositeService from "../interfaces/IReviewCompositeService";
import ReviewedApplicantRecordService from "./reviewedApplicantRecordService";

const Logger = logger(__filename);

const reviewedApplicantRecordService = new ReviewedApplicantRecordService();

/**
 * Builds the ORDER BY clause shared by the review dashboard queries so the
 * paginated rows and the full applicant-record-id list walk the same order.
 *
 * Reviewers are a hasMany loaded via `separate: true`, so their names are
 * not in the main query and a plain ORDER BY can't reference them. Instead,
 * order by the Nth reviewer's "last first" name via a correlated subquery
 * (LIMIT 1 OFFSET idx mirrors how reviewers[idx] is picked in the DTO).
 * Sorting in SQL means it runs *before* LIMIT/OFFSET, so the right rows
 * land on each page — sorting the returned page in JS would only order
 * within a page, since the DB would already have chosen the page by id.
 * COALESCE(...,'') keeps records missing that reviewer ordered as empty
 * strings (first on ASC, last on DESC), and id is a stable tiebreak.
 */
function buildReviewDashboardOrder(
  sortBy?: ReviewDashboardSortBy,
  sortAscending?: boolean,
): Order {
  const direction = sortAscending === false ? "DESC" : "ASC";

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

  if (
    sortBy === ReviewDashboardSortByEnum.REVIEWER_1 ||
    sortBy === ReviewDashboardSortByEnum.REVIEWER_2
  ) {
    const idx = sortBy === ReviewDashboardSortByEnum.REVIEWER_1 ? 0 : 1;
    return [
      [
        literal(`COALESCE((
          SELECT u."last_name" || ' ' || u."first_name"
          FROM "reviewed_applicant_records" AS r
          JOIN "users" AS u ON u."id" = r."reviewer_id"
          WHERE r."applicant_record_id" = "ApplicantRecord"."id"
          ORDER BY r."createdAt" ASC, r."reviewer_id" ASC
          LIMIT 1 OFFSET ${idx}
        ), '')`),
        direction,
      ],
      ["id", "ASC"],
    ];
  }
  if (sortBy) {
    return [sortColumnMap[sortBy], ["id", "ASC"]];
  }
  return [["id", "ASC"]];
}

class ReviewCompositeService implements IReviewCompositeService {
  /* eslint-disable class-methods-use-this */

  async getReviewedApplicantRecordsByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<ApplicantRecordWithReviewersDTO> {
    try {
      const applicantRecord = await ApplicantRecord.findByPk(applicantRecordId);
      if (!applicantRecord) {
        throw new Error(
          `ApplicantRecord with id ${applicantRecordId} not found.`,
        );
      }

      const records = await ReviewedApplicantRecord.findAll({
        where: { applicant_record_id: applicantRecordId },
        include: [{ model: User, as: "reviewer" }],
      });

      return {
        applicantRecord: toApplicantRecordDTO(applicantRecord),
        reviewedApplicantRecords: records.map(
          toReviewedApplicantRecordWithReviewerDTO,
        ),
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to get reviewed applicant records by applicant record id. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

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
    sortAscending?: boolean,
  ): Promise<ReviewDashboardRowDTO[]> {
    try {
      const perPage = Number.isFinite(Number(resultsPerPage))
        ? Number(resultsPerPage)
        : 1;
      const currentPage = Number.isFinite(Number(pageNumber))
        ? Number(pageNumber)
        : 1;
      const offsetRow = (currentPage - 1) * perPage;

      const order = buildReviewDashboardOrder(sortBy, sortAscending);

      // get applicant_record
      // JOIN applicant ON applicant_id
      // JOIN reviewed_applicant_record ON applicant_record_id
      // JOIN user ON reviewer_id
      //
      // separate: true runs the hasMany as a second query, so the main query is a
      // plain BelongsTo join — Sequelize won't wrap it in a subquery, which lets
      // ORDER BY reference the "applicant" table directly.
      const applicantRecords = await ApplicantRecord.findAll({
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

  async getReviewDashboardApplicantRecordIds(
    sortBy?: ReviewDashboardSortBy,
    sortAscending?: boolean,
  ): Promise<string[]> {
    try {
      const applicantRecords = await ApplicantRecord.findAll({
        attributes: ["id"],
        include: [
          {
            // Joined with no attributes so the ORDER BY can reference
            // applicant columns without fetching them.
            attributes: [],
            model: Applicant,
          },
        ],
        order: buildReviewDashboardOrder(sortBy, sortAscending),
      });
      return applicantRecords.map((applicantRecord) => applicantRecord.id);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get review dashboard applicant record ids. Reason = ${getErrorMessage(
          error,
        )}`,
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
