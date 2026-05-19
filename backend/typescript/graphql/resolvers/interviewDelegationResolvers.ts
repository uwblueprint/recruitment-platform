import InterviewDelegationService from "../../services/implementations/interviewDelegationService";
import IInterviewDelegationService from "../../services/interfaces/IInterviewDelegationService";
import {
  CreateInterviewDelegationDTO,
  InterviewDelegationDTO,
  UpdateInterviewDelegationDTO,
} from "../../types";

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
      return interviewDelegationsService.getInterviewDelegation(
        interviewedApplicantRecordId,
        interviewerId,
      );
    },
  },
  Mutation: {
    createInterviewDelegation: async (
      _parent: undefined,
      {
        interviewDelegation,
      }: { interviewDelegation: CreateInterviewDelegationDTO },
    ): Promise<InterviewDelegationDTO> => {
      return interviewDelegationsService.createInterviewDelegation(
        interviewDelegation,
      );
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
      return interviewDelegationsService.updateInterviewDelegation(
        interviewedApplicantRecordId,
        interviewerId,
        interviewDelegation,
      );
    },

    deleteInterviewDelegation: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
        interviewerId,
      }: { interviewedApplicantRecordId: string; interviewerId: string },
    ): Promise<InterviewDelegationDTO> => {
      return interviewDelegationsService.deleteInterviewDelegation(
        interviewedApplicantRecordId,
        interviewerId,
      );
    },

    bulkCreateInterviewDelegations: async (
      _parent: undefined,
      { delegations }: { delegations: CreateInterviewDelegationDTO[] },
    ): Promise<InterviewDelegationDTO[]> => {
      return interviewDelegationsService.bulkCreateInterviewDelegations(
        delegations,
      );
    },
  },
};

export default interviewDelegationsResolvers;
