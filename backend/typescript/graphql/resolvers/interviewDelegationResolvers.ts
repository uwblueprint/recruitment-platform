import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import InterviewDelegationService from "../../services/implementations/interviewDelegationService";
import IInterviewCompositeService from "../../services/interfaces/IInterviewCompositeService";
import IInterviewDelegationService from "../../services/interfaces/IInterviewDelegationService";
import {
  CreateInterviewDelegationDTO,
  InterviewDelegationDTO,
  UpdateInterviewDelegationDTO,
} from "../../types";

const interviewDelegationsService: IInterviewDelegationService = new InterviewDelegationService();
const interviewCompositeService: IInterviewCompositeService = new InterviewCompositeService();

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

    reassignInterviewer: async (
      _parent: undefined,
      {
        applicantRecordId,
        oldInterviewerId,
        newInterviewerId,
      }: {
        applicantRecordId: string;
        oldInterviewerId: string;
        newInterviewerId: string;
      },
    ): Promise<InterviewDelegationDTO> => {
      return interviewCompositeService.reassignInterviewer(
        applicantRecordId,
        oldInterviewerId,
        newInterviewerId,
      );
    },
  },
};

export default interviewDelegationsResolvers;
