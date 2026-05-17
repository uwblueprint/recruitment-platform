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
    getReviewedApplicantRecord: async (
      _parent: undefined,
      args: { applicantRecordId: string; reviewerId: number },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.getReviewedApplicantRecordByPk(
          args.applicantRecordId,
          args.reviewerId,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
  Mutation: {
    createReviewedApplicantRecord: async (
      _parent: undefined,
      args: { reviewedApplicantRecord: CreateReviewedApplicantRecordDTO },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.createReviewedApplicantRecord(
          args.reviewedApplicantRecord,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    bulkCreateReviewedApplicantRecord: async (
      _parent: undefined,
      args: { reviewedApplicantRecords: CreateReviewedApplicantRecordDTO[] },
    ): Promise<ReviewedApplicantRecordDTO[]> => {
      try {
        return await reviewedApplicantRecordService.bulkCreateReviewedApplicantRecord(
          args.reviewedApplicantRecords,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    deleteReviewedApplicantRecord: async (
      _parent: undefined,
      args: { applicantRecordId: string; reviewerId: number },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.deleteReviewedApplicantRecordByPk(
          args.applicantRecordId,
          args.reviewerId,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    updateReviewedApplicantRecord: async (
      _parent: undefined,
      args: { applicantRecordId: string; reviewerId: number; reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO },
    ): Promise<ReviewedApplicantRecordDTO> => {
      try {
        return await reviewedApplicantRecordService.updateReviewedApplicantRecord(
          args.applicantRecordId,
          args.reviewerId,
          {
            review: args.reviewedApplicantRecord.review,
            status: args.reviewedApplicantRecord.status,
            reviewerHasConflict: args.reviewedApplicantRecord.reviewerHasConflict,
          },
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
};

export default reviewedApplicantRecordResolvers;
