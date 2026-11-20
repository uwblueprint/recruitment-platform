import { ExpressContext } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import ReviewCompositeService from "../../services/implementations/reviewCompositeService";
import ApplicantRecordService from "../../services/implementations/applicantRecordService";
import ApplicantService from "../../services/implementations/applicantService";
import { toApplicationDTO } from "../../utilities/dtoUtils";
import { sequelize } from "../../models";

import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import InterviewDelegationService from "../../services/implementations/interviewDelegationService";
import InterviewedApplicantRecordsService from "../../services/implementations/interviewedApplicantRecordService";
import FirebaseFileService from "../../services/implementations/firebaseFileService";
import FileStorageService from "../../services/implementations/fileStorageService";
import {
  ApplicationDTO,
  ApplicantRecordWithReviewersDTO,
  InterviewConflict,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
  InterviewNotesDTO,
  InterviewPairingsDTO,
  InterviewStatusEnum,
  UserDTO,
} from "../../types";
import {
  canUserAccessInterview,
  getUserIdFromContext,
} from "../../middlewares/auth";
import { getErrorMessage } from "../../utilities/errorUtils";
import { withUploadAsTempFile } from "../../utilities/graphqlUploadUtils";
import { INTERVIEW_NOTES_TMP_DIR_PREFIX } from "../../constants/interviewNotes";

const applicantRecordService = new ApplicantRecordService();
const applicantService = new ApplicantService();
const interviewNotesBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const firebaseFileService = new FirebaseFileService(
  new FileStorageService(interviewNotesBucket),
);

const reviewCompositeService = new ReviewCompositeService();
const interviewCompositeService = new InterviewCompositeService();
const interviewedApplicantRecordsService = new InterviewedApplicantRecordsService();
const interviewDelegationsService = new InterviewDelegationService();

const interviewPageResolvers = {
  Query: {
    interviewReviewDetails: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<ApplicantRecordWithReviewersDTO> => {
      return reviewCompositeService.getReviewedApplicantRecordsByApplicantRecordId(
        applicantRecordId,
      );
    },
    canAccessInterview: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
      context: ExpressContext,
    ): Promise<boolean> => {
      const userId = await getUserIdFromContext(context);
      return canUserAccessInterview(userId, { applicantRecordId });
    },
    interviewApplication: async (
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
    interviewedApplicantsByUserId: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<InterviewedApplicantsDTO[]> => {
      return interviewCompositeService.getInterviewedApplicantsByUserId(userId);
    },
    interviewedPairingsByUserId: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<InterviewPairingsDTO[]> => {
      return interviewCompositeService.getInterviewedPairingsByUserId(userId);
    },
    interviewersByGroupId: async (
      _parent: undefined,
      { groupId }: { groupId: string },
    ): Promise<UserDTO[]> => {
      return interviewCompositeService.getInterviewersByGroupId(groupId);
    },
    interviewedApplicantRecordByApplicantRecordId: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.getInterviewedApplicantRecordByApplicantRecordId(
        applicantRecordId,
      );
    },
    interviewNotes: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
      }: { interviewedApplicantRecordId: string },
    ): Promise<InterviewNotesDTO | null> => {
      const record = await interviewedApplicantRecordsService.getInterviewedApplicantRecordById(
        interviewedApplicantRecordId,
      );
      if (!record.interviewNotesId) {
        return null;
      }
      const file = await firebaseFileService.getFirebaseFileById(
        record.interviewNotesId,
      );
      const signedUrl = await firebaseFileService.getSignedUrl(
        file.storagePath,
      );
      return { fileId: file.id, fileName: file.originalFileName, signedUrl };
    },
  },
  Mutation: {
    uploadInterviewNotes: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
        file,
      }: {
        interviewedApplicantRecordId: string;
        file: Promise<FileUpload>;
      },
      context: ExpressContext,
    ): Promise<InterviewNotesDTO> => {
      const uploadedUserId = await getUserIdFromContext(context);
      return withUploadAsTempFile(
        file,
        INTERVIEW_NOTES_TMP_DIR_PREFIX,
        (upload) =>
          interviewCompositeService.uploadInterviewNotes(
            interviewedApplicantRecordId,
            { ...upload, uploadedUserId },
          ),
      );
    },
    reportInterviewConflict: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
        interviewerId,
        interviewHasConflict,
      }: {
        interviewedApplicantRecordId: string;
        interviewerId: string;
        interviewHasConflict: InterviewConflict;
      },
    ): Promise<InterviewedApplicantRecordDTO> => {
      const t = await sequelize.transaction();
      try {
        await interviewDelegationsService.updateInterviewDelegation(
          interviewedApplicantRecordId,
          interviewerId,
          { interviewHasConflict },
          t,
        );
        const result = await interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
          interviewedApplicantRecordId,
          { status: InterviewStatusEnum.CONFLICT_REPORTED },
          t,
        );
        await t.commit();
        return result;
      } catch (error) {
        await t.rollback();
        throw new Error(getErrorMessage(error));
      }
    },
  },
};

export default interviewPageResolvers;
