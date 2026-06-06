import ReviewedApplicantRecordService from "../../services/implementations/reviewedApplicantRecordService";
import {
  ReviewedApplicantRecordDTO,
  ReviewedApplicantRecordWithReviewerDTO,
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

    reviewedApplicantRecordsByApplicantRecordId: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<ReviewedApplicantRecordWithReviewerDTO[]> => {
      return reviewedApplicantRecordService.getReviewedApplicantRecordsByApplicantRecordId(
        applicantRecordId,
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
  },
};

export default reviewedApplicantRecordResolvers;
