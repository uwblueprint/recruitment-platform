import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import IInterviewCompositeService from "../../services/interfaces/IInterviewCompositeService";
import {
  InterviewDashboardRowDTO,
  InterviewDashboardCountsDTO,
  DashboardFilters,
  DashboardView,
  InterviewDashboardSortBy,
  InterviewDashboardSidePanelDTO,
  InterviewDelegationDTO,
} from "../../types";

const interviewCompositeService: IInterviewCompositeService = new InterviewCompositeService();

const interviewDashboardResolvers = {
  Query: {
    interviewDashboardCounts: async (
      _parent: undefined,
      { filters }: { filters?: DashboardFilters },
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
        filters?: DashboardFilters;
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
