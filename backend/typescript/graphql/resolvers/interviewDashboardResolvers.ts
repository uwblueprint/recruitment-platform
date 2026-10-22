import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import IInterviewCompositeService from "../../services/interfaces/IInterviewCompositeService";
import {
  InterviewDashboardRowDTO,
  InterviewDashboardCountsDTO,
  DashboardView,
  InterviewDashboardSortBy,
  InterviewDashboardSidePanelDTO,
  InterviewDelegationDTO,
} from "../../types";

const interviewCompositeService: IInterviewCompositeService = new InterviewCompositeService();

const interviewDashboardResolvers = {
  Query: {
    interviewDashboardCounts: async (): Promise<InterviewDashboardCountsDTO> => {
      return interviewCompositeService.getInterviewDashboardCounts();
    },
    interviewDashboard: async (
      _parent: undefined,
      {
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        view,
      }: {
        pageNumber: number;
        resultsPerPage: number;
        sortBy?: InterviewDashboardSortBy;
        sortAscending?: boolean;
        view?: DashboardView;
      },
    ): Promise<InterviewDashboardRowDTO[]> => {
      return interviewCompositeService.getInterviewDashboard(
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        view,
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
