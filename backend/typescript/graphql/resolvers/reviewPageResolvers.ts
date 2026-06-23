import {
  ApplicantRecordWithReviewersDTO,
  ApplicationDTO,
  ReviewedApplicantRecordDTO,
  ReviewedApplicantsDTO,
  ReviewStatusEnum,
} from "../../types";
import { toApplicationDTO } from "../../utilities/dtoUtils";
import ApplicantRecordService from "../../services/implementations/applicantRecordService";
import ApplicantService from "../../services/implementations/applicantService";
import ReviewedApplicantRecordService from "../../services/implementations/reviewedApplicantRecordService";
import ReviewCompositeService from "../../services/implementations/reviewCompositeService";

const applicantRecordService = new ApplicantRecordService();
const applicantService = new ApplicantService();
const reviewedApplicantRecordService = new ReviewedApplicantRecordService();
const reviewCompositeService = new ReviewCompositeService();
const reviewPageResolvers = {
  Query: {
    application: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<ApplicationDTO> => {
      const applicantRecord = await applicantRecordService.getApplicantRecordById(
        applicantRecordId,
      );
      const applicant = await applicantService.getApplicantById(
        applicantRecord.applicantId,
      );
      return toApplicationDTO(applicant, applicantRecord);
    },
    reviewedApplicantsByUserId: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<ReviewedApplicantsDTO[]> => {
      return reviewCompositeService.getReviewedApplicantsByUserId(userId);
    },
    reviewedApplicantRecordsByApplicantRecordId: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<ApplicantRecordWithReviewersDTO> => {
      return reviewCompositeService.getReviewedApplicantRecordsByApplicantRecordId(
        applicantRecordId,
      );
    },
  },
  Mutation: {
    reportReviewConflict: async (
      _parent: undefined,
      {
        applicantRecordId,
        reviewerId,
      }: { applicantRecordId: string; reviewerId: string },
    ): Promise<ReviewedApplicantRecordDTO> => {
      return reviewedApplicantRecordService.updateReviewedApplicantRecord(
        applicantRecordId,
        reviewerId,
        {
          reviewerHasConflict: true,
          status: ReviewStatusEnum.CONFLICT,
        },
      );
    },
  },
};

export default reviewPageResolvers;
