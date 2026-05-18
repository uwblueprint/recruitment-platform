import ReviewedApplicantRecordService from "../../services/implementations/reviewedApplicantRecordService";
import {
  ReviewedApplicantRecordDTO,
  CreateReviewedApplicantRecordDTO,
  UpdateReviewedApplicantRecordDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";

const reviewedApplicantRecordService = new ReviewedApplicantRecordService();

const reviewedApplicantRecordResolvers = {
  Query: {
    reviewedApplicantRecord: async (
      _parent: undefined,
      { applicantRecordId, reviewerId }: { applicantRecordId: string; reviewerId: string },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.getReviewedApplicantRecordByPk(
          applicantRecordId,
          reviewerId,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
  Mutation: {
    createReviewedApplicantRecord: async (
      _parent: undefined,
      { reviewedApplicantRecord }: { reviewedApplicantRecord: CreateReviewedApplicantRecordDTO },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.createReviewedApplicantRecord(
          reviewedApplicantRecord,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    bulkCreateReviewedApplicantRecord: async (
      _parent: undefined,
      { reviewedApplicantRecords }: { reviewedApplicantRecords: CreateReviewedApplicantRecordDTO[] },
    ): Promise<ReviewedApplicantRecordDTO[]> => {
      try {
        return await reviewedApplicantRecordService.bulkCreateReviewedApplicantRecord(
          reviewedApplicantRecords,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    deleteReviewedApplicantRecord: async (
      _parent: undefined,
      { applicantRecordId, reviewerId }: { applicantRecordId: string; reviewerId: string },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.deleteReviewedApplicantRecordByPk(
          applicantRecordId,
          reviewerId,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    updateReviewedApplicantRecord: async (
      _parent: undefined,
      { applicantRecordId, reviewerId, reviewedApplicantRecord }: {
        applicantRecordId: string;
        reviewerId: string;
        reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO;
      },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.updateReviewedApplicantRecord(
          applicantRecordId,
          reviewerId,
          {
            review: reviewedApplicantRecord.review,
            status: reviewedApplicantRecord.status,
            reviewerHasConflict:
              reviewedApplicantRecord.reviewerHasConflict,
          },
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
};

export default reviewedApplicantRecordResolvers;
