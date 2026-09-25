import ReviewCompositeService from "../../services/implementations/reviewCompositeService";
import {
  DashboardView,
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
        view,
      }: {
        pageNumber: number;
        resultsPerPage: number;
        sortBy?: ReviewDashboardSortBy;
        sortAscending?: boolean;
        view?: DashboardView;
      },
    ): Promise<ReviewDashboardRowDTO[]> => {
      return reviewCompositeService.getReviewDashboard(
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        view,
      );
    },
    reviewDashboardApplicantRecordIds: async (
      _parent: undefined,
      {
        sortBy,
        sortAscending,
      }: {
        sortBy?: ReviewDashboardSortBy;
        sortAscending?: boolean;
      },
    ): Promise<string[]> => {
      return reviewCompositeService.getReviewDashboardApplicantRecordIds(
        sortBy,
        sortAscending,
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
