import { sequelize } from "../../models";
import ReviewedApplicantRecordService from "../../services/implementations/reviewedApplicantRecordService";
import {
  ReviewedApplicantRecordDTO,
  CreateReviewedApplicantRecordDTO,
  UpdateReviewedApplicantRecordDTO,
} from "../../types";

const reviewedApplicantRecordService = new ReviewedApplicantRecordService();

const reviewedApplicantRecordResolvers = {
  Query: {
    reviewedApplicantRecord: async (
      _parent: undefined,
      {
        applicantRecordId,
        reviewerId,
      }: { applicantRecordId: string; reviewerId: string },
    ): Promise<ReviewedApplicantRecordDTO> => {
      return reviewedApplicantRecordService.getReviewedApplicantRecordByPk(
        applicantRecordId,
        reviewerId,
      );
    },
  },
  Mutation: {
    createReviewedApplicantRecord: async (
      _parent: undefined,
      {
        reviewedApplicantRecord,
      }: { reviewedApplicantRecord: CreateReviewedApplicantRecordDTO },
    ): Promise<ReviewedApplicantRecordDTO> => {
      return reviewedApplicantRecordService.createReviewedApplicantRecord(
        reviewedApplicantRecord,
      );
    },

    bulkCreateReviewedApplicantRecord: async (
      _parent: undefined,
      {
        reviewedApplicantRecords,
      }: { reviewedApplicantRecords: CreateReviewedApplicantRecordDTO[] },
    ): Promise<ReviewedApplicantRecordDTO[]> => {
      return reviewedApplicantRecordService.bulkCreateReviewedApplicantRecord(
        reviewedApplicantRecords,
      );
    },

    deleteReviewedApplicantRecord: async (
      _parent: undefined,
      {
        applicantRecordId,
        reviewerId,
      }: { applicantRecordId: string; reviewerId: string },
    ): Promise<ReviewedApplicantRecordDTO> => {
      return reviewedApplicantRecordService.deleteReviewedApplicantRecordByPk(
        applicantRecordId,
        reviewerId,
      );
    },

    updateReviewedApplicantRecord: async (
      _parent: undefined,
      {
        applicantRecordId,
        reviewerId,
        reviewedApplicantRecord,
      }: {
        applicantRecordId: string;
        reviewerId: string;
        reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO;
      },
    ): Promise<ReviewedApplicantRecordDTO> => {
      return reviewedApplicantRecordService.updateReviewedApplicantRecord(
        applicantRecordId,
        reviewerId,
        {
          review: reviewedApplicantRecord.review,
          status: reviewedApplicantRecord.status,
          reviewerHasConflict: reviewedApplicantRecord.reviewerHasConflict,
        },
      );
    },
    reassignReviewer: async (
      _parent: undefined,
      {
        applicantRecordId,
        oldReviewerId,
        newReviewerId,
      }: {
        applicantRecordId: string;
        oldReviewerId: string;
        newReviewerId: string;
      },
    ): Promise<ReviewedApplicantRecordDTO> => {
      const transaction = await sequelize.transaction();
      try {
        await reviewedApplicantRecordService.deleteReviewedApplicantRecordByPk(
          applicantRecordId,
          oldReviewerId,
          transaction,
        );

        const newRecord = await reviewedApplicantRecordService.createReviewedApplicantRecord(
          {
            applicantRecordId,
            reviewerId: newReviewerId,
            status: "TODO",
          },
          transaction,
        );
        await transaction.commit();
        return newRecord;
      } catch (error: unknown) {
        await transaction.rollback();
        throw error;
      }
    },
  },
};

export default reviewedApplicantRecordResolvers;
