import InterviewDelegationService from "../../services/implementations/interviewDelegationService";
import IInterviewDelegationService from "../../services/interfaces/IInterviewDelegationService";
import {
  CreateInterviewDelegationDTO,
  InterviewDelegationDTO,
  UpdateInterviewDelegationDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";

const interviewDelegationsService: IInterviewDelegationService = new InterviewDelegationService();

const interviewDelegationsResolvers = {
  Query: {
    interviewDelegation: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
        interviewerId,
      }: { interviewedApplicantRecordId: string; interviewerId: string },
    ): Promise<InterviewDelegationDTO> => {
      try {
        return await interviewDelegationsService.getInterviewDelegation(
          interviewedApplicantRecordId,
          interviewerId,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
  Mutation: {
    createInterviewDelegation: async (
      _parent: undefined,
      {
        interviewDelegation,
      }: { interviewDelegation: CreateInterviewDelegationDTO },
    ): Promise<InterviewDelegationDTO> => {
      try {
        return await interviewDelegationsService.createInterviewDelegation(
          interviewDelegation,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    updateInterviewDelegation: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
        interviewerId,
        interviewDelegation,
      }: {
        interviewedApplicantRecordId: string;
        interviewerId: string;
        interviewDelegation: UpdateInterviewDelegationDTO;
      },
    ): Promise<InterviewDelegationDTO> => {
      try {
        return await interviewDelegationsService.updateInterviewDelegation(
          interviewedApplicantRecordId,
          interviewerId,
          interviewDelegation,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    deleteInterviewDelegation: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
        interviewerId,
      }: { interviewedApplicantRecordId: string; interviewerId: string },
    ): Promise<InterviewDelegationDTO> => {
      try {
        return await interviewDelegationsService.deleteInterviewDelegation(
          interviewedApplicantRecordId,
          interviewerId,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    bulkCreateInterviewDelegations: async (
      _parent: undefined,
      { delegations }: { delegations: CreateInterviewDelegationDTO[] },
    ): Promise<InterviewDelegationDTO[]> => {
      try {
        return await interviewDelegationsService.bulkCreateInterviewDelegations(
          delegations,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
};

export default interviewDelegationsResolvers;
