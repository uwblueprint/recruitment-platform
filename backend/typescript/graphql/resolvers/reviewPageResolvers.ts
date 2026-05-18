import {
    ApplicantDTO,
    ApplicantRecordDTO,
    ApplicationDTO,
    ReviewedApplicantRecordDTO,
    ReviewedApplicantsDTO,
    ReviewStatusEnum,
  } from "../../types";
  import { getErrorMessage } from "../../utilities/errorUtils";
import ApplicantRecordService from "../../services/implementations/applicantRecordService";
import ApplicantService from "../../services/implementations/applicantService";
import ReviewedApplicantRecordService from "../../services/implementations/reviewedApplicantRecordService";
import ReviewCompositeService from "../../services/implementations/reviewCompositeService";
  
  const applicantRecordService = new ApplicantRecordService();
  const applicantService = new ApplicantService();
  const reviewedApplicantRecordService = new ReviewedApplicantRecordService();
  const reviewCompositeService = new ReviewCompositeService();
  const toDTO = (applicant: ApplicantDTO, applicantRecord: ApplicantRecordDTO): ApplicationDTO => {
  
    return {
      id: applicant.id,
      academicOrCoop: applicant.academicOrCoop,
      academicYear: applicant.academicYear,
      email: applicant.email,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      heardFrom: applicant.heardFrom,
      locationPreference: applicant.locationPreference,
      program: applicant.program,
      timesApplied: applicant.timesApplied.toString(),
      pronouns: applicant.pronouns,
      pronounsSpecified: applicant.pronouns,
      resumeUrl: applicant.resumeUrl,
      roleSpecificQuestions: applicantRecord.roleSpecificQuestions,
      shortAnswerQuestions: applicant.shortAnswerQuestions,
      status: applicantRecord.status,
      term: applicant.term,
      submittedAt: applicant.submittedAt,
  };
}
  const reviewPageResolvers = {
    Query: {
      application: async (
        _parent: undefined,
        { applicantRecordId }: { applicantRecordId: string },
      ): Promise<ApplicationDTO> => {
        try {
            const applicantRecord = await applicantRecordService.getApplicantRecordById(applicantRecordId);
            const applicant = await applicantService.getApplicantById(applicantRecord.applicantId);
          return {
            ...toDTO(applicant, applicantRecord),
          };
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      reviewedApplicantsByUserId: async (
        _parent: undefined,
        { userId }: { userId: string },
      ): Promise<ReviewedApplicantsDTO[]> => {
        try {
          return await reviewCompositeService.getReviewedApplicantsByUserId(
            userId,
          );
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
    },
    Mutation: {
      reportReviewConflict: async (
        _parent: undefined,
        { applicantRecordId, reviewerId }: { applicantRecordId: string; reviewerId: string },
      ): Promise<ReviewedApplicantRecordDTO> => {
        try {
          return await reviewedApplicantRecordService.updateReviewedApplicantRecord(
            applicantRecordId,
            reviewerId,
            {
                reviewerHasConflict: true,
                status: ReviewStatusEnum.CONFLICT,
            }
          );
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
    },
  };
  
  export default reviewPageResolvers;
  