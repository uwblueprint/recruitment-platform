import ReviewCompositeService from "../../services/implementations/reviewCompositeService";
import {
  ReviewDashboardRowDTO,
  ReviewDashboardSidePanelDTO,
  ReviewedApplicantRecordDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";

const reviewCompositeService = new ReviewCompositeService();
const reviewDashboardResolvers = {
  Query: {
    reviewDashboard: async (
      _parent: undefined,
      {
        pageNumber,
        resultsPerPage,
      }: { pageNumber: number; resultsPerPage: number },
    ): Promise<ReviewDashboardRowDTO[]> => {
      try {
        return await reviewCompositeService.getReviewDashboard(
          pageNumber,
          resultsPerPage,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    reviewDashboardSidePanel: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<ReviewDashboardSidePanelDTO> => {
      try {
        return await reviewCompositeService.getReviewDashboardSidePanel(
          applicantRecordId,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
  Mutation: {
    delegateReviewers: async (
      _parent: undefined,
      { positions }: { positions: string[] },
    ): Promise<ReviewedApplicantRecordDTO[]> => {
      try {
        return await reviewCompositeService.delegateReviewers(positions);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
};

export default reviewDashboardResolvers;
