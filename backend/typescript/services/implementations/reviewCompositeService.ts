import { Op } from "sequelize";
import Applicant from "../../models/applicant.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import ReviewedApplicantRecord from "../../models/reviewedApplicantRecord.model";
import User from "../../models/user.model";
import {
  CreateReviewedApplicantRecordDTO,
  Review,
  ReviewDashboardRowDTO,
  ReviewDashboardSidePanelDTO,
  ReviewedApplicantRecordDTO,
  ReviewedApplicantsDTO,
  ReviewStatus,
  ReviewStatusEnum,
  SkillCategory,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IReviewCompositeService from "../interfaces/IReviewCompositeService";
import ReviewedApplicantRecordService from "./reviewedApplicantRecordService";

const Logger = logger(__filename);

const reviewedApplicantRecordService = new ReviewedApplicantRecordService();

function toReviewedApplicantDTO(
  reviewedApplicantRecord: ReviewedApplicantRecord,
): ReviewedApplicantsDTO {
  return {
    applicantRecordId: reviewedApplicantRecord.applicant_record_id,
    reviewStatus: reviewedApplicantRecord.status,
    applicantFirstName:
      reviewedApplicantRecord.applicant_record.applicant.first_name,
    applicantLastName:
      reviewedApplicantRecord.applicant_record.applicant.last_name,
  };
}

function toReviewDashboardSidePanelDTO(
  applicantRecord: ApplicantRecord,
  reviewedApplicantRecords: ReviewedApplicantRecord[],
): ReviewDashboardSidePanelDTO {
  const reviewDetails = reviewedApplicantRecords?.map((reviewRecord) => ({
    reviewer: {
      id: reviewRecord.reviewer.id.toString(),
      firstName: reviewRecord.reviewer.first_name,
      lastName: reviewRecord.reviewer.last_name,
      email: reviewRecord.reviewer.email,
      role: reviewRecord.reviewer.role,
      position: reviewRecord.reviewer.position,
      isArchived: reviewRecord.reviewer.is_archived,
    },
    review: reviewRecord.review as Review,
    reviewStatus: reviewRecord.status as ReviewStatus,
  }));

  return {
    firstName: applicantRecord.applicant.first_name,
    lastName: applicantRecord.applicant.last_name,
    position: applicantRecord.position,
    program: applicantRecord.applicant.program,
    resumeUrl: applicantRecord.applicant.resume_url,
    applicationStatus: applicantRecord.status,
    skillCategory: applicantRecord.skill_category as SkillCategory,
    reviewDetails,
  };
}

function toReviewDashboardRowDTO(
  applicantRecord: ApplicantRecord,
): ReviewDashboardRowDTO {
  return {
    firstName: applicantRecord.applicant.first_name,
    lastName: applicantRecord.applicant.last_name,
    position: applicantRecord.position,
    timesApplied: applicantRecord.applicant.times_applied.toString(),
    applicationStatus: applicantRecord.status,
    choice: applicantRecord.choice,
    reviewers: (applicantRecord.reviewed_applicant_records ?? []).map((r) => ({
      id: r.reviewer.id.toString(),
      firstName: r.reviewer.first_name,
      lastName: r.reviewer.last_name,
      email: r.reviewer.email,
      role: r.reviewer.role,
      position: r.reviewer.position,
      isArchived: r.reviewer.is_archived,
    })),
    totalScore: applicantRecord.combined_review_score ?? null,
  };
}

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
  ): Promise<ReviewDashboardRowDTO[]> {
    try {
      const perPage = Number.isFinite(Number(resultsPerPage))
        ? Number(resultsPerPage)
        : 1;
      const currentPage = Number.isFinite(Number(pageNumber))
        ? Number(pageNumber)
        : 1;
      const offsetRow = (currentPage - 1) * perPage;

      // get applicant_record
      // JOIN applicant ON applicant_id
      // JOIN reviewed_applicant_record ON applicant_record_id
      // JOIN user ON reviewer_id
      const applicantRecords = await ApplicantRecord.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            attributes: { exclude: ["createdAt", "updatedAt"] },
            model: ReviewedApplicantRecord,
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
        order: [["id", "ASC"]],
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
