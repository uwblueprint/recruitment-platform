import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import IInterviewCompositeService from "../../services/interfaces/IInterviewCompositeService";
import {
  InterviewInviteDTO,
  InterviewGroupStatus,
  InterviewInvitesFilters,
  InterviewInvitesCountsDTO,
} from "../../types";

const interviewCompositeService: IInterviewCompositeService = new InterviewCompositeService();

const interviewInvitesDashboardResolvers = {
  Query: {
    interviewInvites: async (
      _parent: undefined,
      {
        pageNumber,
        resultsPerPage,
        status,
        filters,
      }: {
        pageNumber: number;
        resultsPerPage: number;
        status?: InterviewGroupStatus[];
        filters?: InterviewInvitesFilters;
      },
    ): Promise<InterviewInviteDTO[]> => {
      return interviewCompositeService.getInterviewInvites(
        pageNumber,
        resultsPerPage,
        status,
        filters,
      );
    },
    interviewInvitesCounts: async (
      _parent: undefined,
      { filters }: { filters?: InterviewInvitesFilters },
    ): Promise<InterviewInvitesCountsDTO> =>
      interviewCompositeService.getInterviewInvitesCounts(filters),
  },
};

export default interviewInvitesDashboardResolvers;
