import { sequelize } from "../../models";
import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import InterviewDelegationService from "../../services/implementations/interviewDelegationService";
import InterviewedApplicantRecordsService from "../../services/implementations/interviewedApplicantRecordService";
import {
  InterviewConflict,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
  InterviewPairingsDTO,
  InterviewStatusEnum,
  UserDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";

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
  },
  Mutation: {
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
