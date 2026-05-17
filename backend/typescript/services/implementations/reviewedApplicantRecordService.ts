import { sequelize } from "../../models";
import ReviewedApplicantRecord from "../../models/reviewedApplicantRecord.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import {
  ReviewedApplicantRecordDTO,
  CreateReviewedApplicantRecordDTO,
  UpdateReviewedApplicantRecordDTO,
  Review,
} from "../../types";
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

  Object.entries(scores).forEach(
    ([_field, value]) => !(value && (value < 1 || value > 5)),
  );

  return true;
}

function toDTO(model: ReviewedApplicantRecord): ReviewedApplicantRecordDTO {
  return {
    applicantRecordId: model.applicant_record_id,
    reviewerId: model.reviewer_id,
    review: model.review as Review,
    status: model.status,
    score: model.score,
    reviewerHasConflict: model.reviewer_has_conflict,
  };
}

class ReviewedApplicantRecordService implements IReviewApplicantRecordService {
  /* eslint-disable class-methods-use-this */
  async getReviewedApplicantRecordByPk(
    applicantRecordId: string,
    reviewerId: number,
  ): Promise<ReviewedApplicantRecordDTO> {
    try {
      const reviewedApplicantRecord = await ReviewedApplicantRecord.findOne({
        where: {
          applicant_record_id: applicantRecordId,
          reviewer_id: reviewerId,
        },
      });

      if (!reviewedApplicantRecord) {
        throw new Error("ReviewedApplicantRecord not found");
      }

      return toDTO(reviewedApplicantRecord);
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
  ): Promise<ReviewedApplicantRecordDTO> {
    try {
      if (
        reviewedApplicantRecord.review &&
        !isValidReviewScores(reviewedApplicantRecord.review)
      ) {
        throw new Error("Invalid review scores");
      }

      const createdReviewedApplicantRecord = await ReviewedApplicantRecord.create(
        {
          applicant_record_id: reviewedApplicantRecord.applicantRecordId,
          reviewer_id: reviewedApplicantRecord.reviewerId,
          review: reviewedApplicantRecord.review,
          status: reviewedApplicantRecord.status,
          reviewer_has_conflict: reviewedApplicantRecord.reviewerHasConflict,
        },
      );
      return toDTO(createdReviewedApplicantRecord);
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
      reviewedApplicantRecords.forEach((reviewedApplicantRecord) => {
        if (
          reviewedApplicantRecord.review &&
          !isValidReviewScores(reviewedApplicantRecord.review)
        ) {
          throw new Error("Invalid review scores");
        }
      });

      const createdReviewedApplicantRecords = await ReviewedApplicantRecord.bulkCreate(
        reviewedApplicantRecords.map((reviewedApplicantRecord) => ({
          applicant_record_id: reviewedApplicantRecord.applicantRecordId,
          reviewer_id: reviewedApplicantRecord.reviewerId,
          review: reviewedApplicantRecord.review,
          status: reviewedApplicantRecord.status,
          reviewer_has_conflict: reviewedApplicantRecord.reviewerHasConflict,
        })),
        { transaction },
      );

      await transaction.commit();

      return createdReviewedApplicantRecords.map(toDTO);
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
    reviewerId: number,
  ): Promise<ReviewedApplicantRecordDTO> {
    try {
      const record = await ReviewedApplicantRecord.findOne({
        where: { applicantRecordId, reviewerId },
      });

      if (!record) {
        throw new Error("ReviewedApplicantRecord not found, delete failed");
      }

      await record.destroy();
      return toDTO(record);
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
    reviewerId: number,
    reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO,
  ): Promise<ReviewedApplicantRecordDTO> {
    const transaction = await sequelize.transaction();
    try {
      const { review, status, reviewerHasConflict } = reviewedApplicantRecord;

      const reviewedRecord = await ReviewedApplicantRecord.findOne({
        where: {
          applicant_record_id: applicantRecordId,
          reviewer_id: reviewerId,
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
        return toDTO(reviewedRecord);
      }

      if (!isValidReviewScores(review)) {
        throw new Error("Invalid review scores");
      }

      const updatedReview = {
        ...reviewedRecord.review,
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
        return toDTO(reviewedRecord);
      }

      const newReviewedScore = updatedScore;

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
          combined_review_score: combinedReviewScore + newReviewedScore,
        },
        { where: { id: applicantRecordId }, transaction },
      );

      await transaction.commit();

      return toDTO(reviewedRecord);
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
