import InterviewGroupService from "../../services/implementations/interviewGroupService";
import IInterviewGroupService from "../../services/interfaces/IInterviewGroupService";
import {
  CreateInterviewGroupDTO,
  InterviewGroupDTO,
  InterviewGroupStatusEnum,
  UpdateInterviewGroupDTO,
} from "../../types";

const interviewGroupService: IInterviewGroupService = new InterviewGroupService();

const interviewGroupResolvers = {
  Query: {
    interviewGroup: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<InterviewGroupDTO> => {
      return interviewGroupService.getInterviewGroupById(id);
    },
  },

  Mutation: {
    createInterviewGroup: async (
      _parent: undefined,
      { interviewGroup }: { interviewGroup: CreateInterviewGroupDTO },
    ): Promise<InterviewGroupDTO> => {
      return interviewGroupService.createInterviewGroup(interviewGroup);
    },

    updateInterviewGroup: async (
      _parent: undefined,
      {
        id,
        interviewGroup,
      }: { id: string; interviewGroup: UpdateInterviewGroupDTO },
    ): Promise<InterviewGroupDTO> => {
      return interviewGroupService.updateInterviewGroup(id, interviewGroup);
    },

    updateInterviewGroupSchedulingLink: async (
      _parent: undefined,
      { id, schedulingLink }: { id: string; schedulingLink: string },
    ): Promise<InterviewGroupDTO> => {
      return interviewGroupService.updateInterviewGroup(id, {
        schedulingLink,
        status: InterviewGroupStatusEnum.READY_TO_INTERVIEW,
      });
    },

    deleteInterviewGroupById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<InterviewGroupDTO> => {
      return interviewGroupService.deleteInterviewGroupById(id);
    },

    bulkCreateInterviewGroups: async (
      _parent: undefined,
      { interviewGroups }: { interviewGroups: CreateInterviewGroupDTO[] },
    ): Promise<InterviewGroupDTO[]> => {
      return interviewGroupService.bulkCreateInterviewGroups(interviewGroups);
    },

    bulkDeleteInterviewGroupsByIds: async (
      _parent: undefined,
      { interviewGroupIds }: { interviewGroupIds: string[] },
    ): Promise<InterviewGroupDTO[]> => {
      return interviewGroupService.bulkDeleteInterviewGroupsByIds(
        interviewGroupIds,
      );
    },
  },
};

export default interviewGroupResolvers;
