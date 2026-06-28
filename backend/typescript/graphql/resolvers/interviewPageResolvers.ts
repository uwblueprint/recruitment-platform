import { ExpressContext } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import { sequelize } from "../../models";

import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import InterviewDelegationService from "../../services/implementations/interviewDelegationService";
import InterviewedApplicantRecordsService from "../../services/implementations/interviewedApplicantRecordService";
import {
  Interview,
  InterviewConflict,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
  InterviewNotesDTO,
  InterviewPairingsDTO,
  InterviewStatusEnum,
  UserDTO,
} from "../../types";
import { getUserIdFromContext } from "../../utilities/authUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import { withUploadAsTempFile } from "../../utilities/graphqlUploadUtils";
import { INTERVIEW_NOTES_TMP_DIR_PREFIX } from "../../constants/interviewNotes";

const interviewCompositeService = new InterviewCompositeService();
const interviewedApplicantRecordsService = new InterviewedApplicantRecordsService();
const interviewDelegationsService = new InterviewDelegationService();

const interviewPageResolvers = {
  Query: {
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
      return interviewCompositeService.getInterviewNotesByInterviewedApplicantRecordId(
        interviewedApplicantRecordId,
      );
    },
  },
  Mutation: {
    submitInterviewScores: async (
      _parent: undefined,
      { id, interviewJson }: { id: string; interviewJson: Interview },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewCompositeService.submitInterviewScores(id, interviewJson);
    },
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
            uploadedUserId,
            upload,
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
