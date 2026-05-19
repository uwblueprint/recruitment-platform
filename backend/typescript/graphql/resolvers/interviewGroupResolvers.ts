import InterviewGroupService from "../../services/implementations/interviewGroupService";
import IInterviewGroupService from "../../services/interfaces/IInterviewGroupService";
import {
  CreateInterviewGroupDTO,
  InterviewGroupDTO,
  InterviewGroupStatusEnum,
  UpdateInterviewGroupDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";

const interviewGroupService: IInterviewGroupService = new InterviewGroupService();

const interviewGroupResolvers = {
  Query: {
    interviewGroup: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<InterviewGroupDTO> => {
      try {
        return await interviewGroupService.getInterviewGroupById(id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },

  Mutation: {
    createInterviewGroup: async (
      _parent: undefined,
      { interviewGroup }: { interviewGroup: CreateInterviewGroupDTO },
    ): Promise<InterviewGroupDTO> => {
      try {
        return await interviewGroupService.createInterviewGroup(interviewGroup);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    updateInterviewGroup: async (
      _parent: undefined,
      {
        id,
        interviewGroup,
      }: { id: string; interviewGroup: UpdateInterviewGroupDTO },
    ): Promise<InterviewGroupDTO> => {
      try {
        return await interviewGroupService.updateInterviewGroup(
          id,
          interviewGroup,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    updateInterviewGroupSchedulingLink: async (
      _parent: undefined,
      { id, schedulingLink }: { id: string; schedulingLink: string },
    ): Promise<InterviewGroupDTO> => {
      try {
        return await interviewGroupService.updateInterviewGroup(id, {
          schedulingLink,
          status: InterviewGroupStatusEnum.READY_TO_INTERVIEW,
        });
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    deleteInterviewGroupById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<InterviewGroupDTO> => {
      try {
        return await interviewGroupService.deleteInterviewGroupById(id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    bulkCreateInterviewGroups: async (
      _parent: undefined,
      { interviewGroups }: { interviewGroups: CreateInterviewGroupDTO[] },
    ): Promise<InterviewGroupDTO[]> => {
      try {
        return await interviewGroupService.bulkCreateInterviewGroups(
          interviewGroups,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    bulkDeleteInterviewGroupsByIds: async (
      _parent: undefined,
      { interviewGroupIds }: { interviewGroupIds: string[] },
    ): Promise<InterviewGroupDTO[]> => {
      try {
        return await interviewGroupService.bulkDeleteInterviewGroupsByIds(
          interviewGroupIds,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
};

export default interviewGroupResolvers;
