import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import IInterviewCompositeService from "../../services/interfaces/IInterviewCompositeService";
import {
  InterviewDashboardRowDTO,
  InterviewDashboardCountsDTO,
  InterviewDashboardFilters,
  DashboardView,
  InterviewDashboardSortBy,
  InterviewDashboardSidePanelDTO,
  InterviewDelegationDTO,
  InterviewInviteDTO,
} from "../../types";

const interviewCompositeService: IInterviewCompositeService = new InterviewCompositeService();

const interviewDashboardResolvers = {
  Query: {
    interviewDashboardCounts: async (
      _parent: undefined,
      { filters }: { filters?: InterviewDashboardFilters },
    ): Promise<InterviewDashboardCountsDTO> => {
      return interviewCompositeService.getInterviewDashboardCounts(filters);
    },
    interviewDashboard: async (
      _parent: undefined,
      {
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        view,
        filters,
      }: {
        pageNumber: number;
        resultsPerPage: number;
        sortBy?: InterviewDashboardSortBy;
        sortAscending?: boolean;
        view?: DashboardView;
        filters?: InterviewDashboardFilters;
      },
    ): Promise<InterviewDashboardRowDTO[]> => {
      return interviewCompositeService.getInterviewDashboard(
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        view,
        filters,
      );
    },
    interviewDashboardSidePanel: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<InterviewDashboardSidePanelDTO> => {
      return interviewCompositeService.getInterviewDashboardSidePanel(
        applicantRecordId,
      );
    },
    interviewInvites: async (): Promise<InterviewInviteDTO[]> => {
      return interviewCompositeService.getInterviewInvites();
    },
  },
  Mutation: {
    delegateInterviewers: async (
      _parent: undefined,
      { positions }: { positions: string[] },
    ): Promise<InterviewDelegationDTO[]> => {
      return interviewCompositeService.delegateInterviewers(positions);
    },
  },
};

export default interviewDashboardResolvers;
