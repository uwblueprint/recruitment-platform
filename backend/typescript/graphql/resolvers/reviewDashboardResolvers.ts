import ReviewCompositeService from "../../services/implementations/reviewCompositeService";
import {
  DashboardView,
  ReviewDashboardFilterOptionsDTO,
  ReviewDashboardFilters,
  ReviewDashboardRowDTO,
  ReviewDashboardSidePanelDTO,
  ReviewDashboardSortBy,
  ReviewedApplicantRecordDTO,
} from "../../types";

const reviewCompositeService = new ReviewCompositeService();
const reviewDashboardResolvers = {
  Query: {
    reviewDashboard: async (
      _parent: undefined,
      {
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        filters,
        view,
      }: {
        pageNumber: number;
        resultsPerPage: number;
        sortBy?: ReviewDashboardSortBy;
        sortAscending?: boolean;
        filters?: ReviewDashboardFilters;
        view?: DashboardView;
      },
    ): Promise<ReviewDashboardRowDTO[]> => {
      return reviewCompositeService.getReviewDashboard(
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        filters,
        view,
      );
    },
    reviewDashboardApplicantRecordIds: async (
      _parent: undefined,
      {
        sortBy,
        sortAscending,
        filters,
      }: {
        sortBy?: ReviewDashboardSortBy;
        sortAscending?: boolean;
        filters?: ReviewDashboardFilters;
      },
    ): Promise<string[]> => {
      return reviewCompositeService.getReviewDashboardApplicantRecordIds(
        sortBy,
        sortAscending,
        filters,
      );
    },
    reviewDashboardSidePanel: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<ReviewDashboardSidePanelDTO> => {
      return reviewCompositeService.getReviewDashboardSidePanel(
        applicantRecordId,
      );
    },
    reviewDashboardFilterOptions: async (
      _parent: undefined,
      { department }: { department?: string },
    ): Promise<ReviewDashboardFilterOptionsDTO> => {
      return reviewCompositeService.getReviewDashboardFilterOptions(department);
    },
  },
  Mutation: {
    delegateReviewers: async (
      _parent: undefined,
      { positions }: { positions: string[] },
    ): Promise<ReviewedApplicantRecordDTO[]> => {
      return reviewCompositeService.delegateReviewers(positions);
    },
  },
};

export default reviewDashboardResolvers;
