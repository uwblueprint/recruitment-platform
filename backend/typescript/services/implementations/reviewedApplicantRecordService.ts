import { Transaction } from "sequelize";
import { sequelize } from "../../models";
import ReviewedApplicantRecord from "../../models/reviewedApplicantRecord.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import {
  ReviewedApplicantRecordDTO,
  CreateReviewedApplicantRecordDTO,
  UpdateReviewedApplicantRecordDTO,
  Review,
} from "../../types";
import { toReviewedApplicantRecordDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IReviewApplicantRecordService from "../interfaces/IReviewedApplicantRecordService";

const Logger = logger(__filename);

function isValidReviewScores(review: Review): boolean {
  const scores = {
    passionFSG: review.passionFSG,
    teamPlayer: review.teamPlayer,
    desireToLearn: review.desireToLearn,
    skill: review.skill,
  };

  return !Object.entries(scores).some(
    ([, value]) => value && (value < 1 || value > 5),
  );
}

class ReviewedApplicantRecordService implements IReviewApplicantRecordService {
  /* eslint-disable class-methods-use-this */
  async getReviewedApplicantRecordByPk(
    applicantRecordId: string,
    reviewerId: string,
  ): Promise<ReviewedApplicantRecordDTO> {
    try {
      const reviewedApplicantRecord = await ReviewedApplicantRecord.findOne({
        where: {
          applicant_record_id: applicantRecordId,
          reviewer_id: Number(reviewerId),
        },
      });

      if (!reviewedApplicantRecord) {
        throw new Error("ReviewedApplicantRecord not found");
      }

      return toReviewedApplicantRecordDTO(reviewedApplicantRecord);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get reviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createReviewedApplicantRecord(
    reviewedApplicantRecord: CreateReviewedApplicantRecordDTO,
    transaction?: Transaction,
  ): Promise<ReviewedApplicantRecordDTO> {
    try {
      const createdReviewedApplicantRecord = await ReviewedApplicantRecord.create(
        {
          applicant_record_id: reviewedApplicantRecord.applicantRecordId,
          reviewer_id: Number(reviewedApplicantRecord.reviewerId),
          status: reviewedApplicantRecord.status,
        },
        { transaction },
      );
      return toReviewedApplicantRecordDTO(createdReviewedApplicantRecord);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create reviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async bulkCreateReviewedApplicantRecord(
    reviewedApplicantRecords: CreateReviewedApplicantRecordDTO[],
  ): Promise<ReviewedApplicantRecordDTO[]> {
    const transaction = await sequelize.transaction();
    try {
      const createdReviewedApplicantRecords = await ReviewedApplicantRecord.bulkCreate(
        reviewedApplicantRecords.map((reviewedApplicantRecord) => ({
          applicant_record_id: reviewedApplicantRecord.applicantRecordId,
          reviewer_id: Number(reviewedApplicantRecord.reviewerId),
          status: reviewedApplicantRecord.status,
        })),
        { transaction },
      );

      await transaction.commit();

      return createdReviewedApplicantRecords.map(toReviewedApplicantRecordDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to bulk create reviewed applicant records. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      await transaction.rollback();
      throw error;
    }
  }

  async deleteReviewedApplicantRecordByPk(
    applicantRecordId: string,
    reviewerId: string,
    transaction?: Transaction,
  ): Promise<ReviewedApplicantRecordDTO> {
    try {
      const record = await ReviewedApplicantRecord.findOne({
        where: {
          applicant_record_id: applicantRecordId,
          reviewer_id: Number(reviewerId),
        },
        transaction,
      });

      if (!record) {
        throw new Error("ReviewedApplicantRecord not found, delete failed");
      }

      await record.destroy({ transaction });
      return toReviewedApplicantRecordDTO(record);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete reviewed applicant records. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async updateReviewedApplicantRecord(
    applicantRecordId: string,
    reviewerId: string,
    reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO,
  ): Promise<ReviewedApplicantRecordDTO> {
    const transaction = await sequelize.transaction();
    try {
      const { review, status, reviewerHasConflict } = reviewedApplicantRecord;

      const reviewedRecord = await ReviewedApplicantRecord.findOne({
        where: {
          applicant_record_id: applicantRecordId,
          reviewer_id: Number(reviewerId),
        },
        transaction,
      });

      if (!reviewedRecord) {
        throw new Error(
          `ReviewedApplicantRecord not found for applicantRecordId: ${applicantRecordId} and reviewerId: ${reviewerId}`,
        );
      }

      await reviewedRecord.update(
        {
          status,
          reviewer_has_conflict: reviewerHasConflict,
        },
        { transaction },
      );

      // update reviews
      if (!review) {
        await transaction.commit();
        return toReviewedApplicantRecordDTO(reviewedRecord);
      }

      if (!isValidReviewScores(review)) {
        throw new Error("Invalid review scores");
      }

      const updatedReview = {
        ...(reviewedRecord.review ?? {}),
        ...review,
      };

      const { passionFSG, teamPlayer, desireToLearn, skill } = updatedReview;

      let calculatedScore = 0;
      if (passionFSG) calculatedScore += passionFSG;
      if (teamPlayer) calculatedScore += teamPlayer;
      if (desireToLearn) calculatedScore += desireToLearn;
      if (skill) calculatedScore += skill;
      const updatedScore = calculatedScore > 0 ? calculatedScore : null;

      await reviewedRecord.update(
        {
          review: updatedReview,
          score: updatedScore,
        },
        { transaction },
      );

      if (!updatedScore) {
        await transaction.commit();
        return toReviewedApplicantRecordDTO(reviewedRecord);
      }

      const applicantRecord = await ApplicantRecord.findOne({
        where: { id: applicantRecordId },
        transaction,
      });

      if (!applicantRecord) {
        throw new Error(
          `ApplicantRecord not found for applicantRecordId: ${applicantRecordId}`,
        );
      }

      const reviewedRecords = await ReviewedApplicantRecord.findAll({
        where: { applicant_record_id: applicantRecordId },
        transaction,
      });

      const combinedReviewScore = reviewedRecords.reduce(
        (sum, record) => sum + (record.score ?? 0),
        0,
      );

      await applicantRecord.update(
        {
          combined_review_score: combinedReviewScore,
        },
        { where: { id: applicantRecordId }, transaction },
      );

      await transaction.commit();

      return toReviewedApplicantRecordDTO(reviewedRecord);
    } catch (error: unknown) {
      await transaction.rollback();
      Logger.error(
        `Failed to update reviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default ReviewedApplicantRecordService;
