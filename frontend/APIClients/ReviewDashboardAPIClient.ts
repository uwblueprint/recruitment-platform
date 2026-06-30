import { client } from "@/client";
import {
  ReviewDashboardDocument,
  ReviewDashboardSidePanelDocument,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
  type ReviewDashboardResult,
  type ReviewDashboardSidePanelQuery,
  type ReviewDashboardSidePanelQueryVariables,
  type ReviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class ReviewDashboardAPIClient {
  static async getReviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
  ): Promise<ReviewDashboardResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardQuery,
        ReviewDashboardQueryVariables
      >({
        query: ReviewDashboardDocument,
        variables: { pageNumber, resultsPerPage },
        fetchPolicy: "network-only",
      });

      if (!data?.reviewDashboard) {
        throw new Error("No data returned");
      }

      return data.reviewDashboard;
    } catch {
      throw new Error("Failed to get review dashboard");
    }
  }

  static async getReviewDashboardSidePanel(
    applicantRecordId: string,
  ): Promise<ReviewDashboardSidePanelResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardSidePanelQuery,
        ReviewDashboardSidePanelQueryVariables
      >({
        query: ReviewDashboardSidePanelDocument,
        variables: { applicantRecordId },
        fetchPolicy: "network-only",
      });

      if (!data?.reviewDashboardSidePanel) {
        throw new Error("No data returned");
      }

      return data.reviewDashboardSidePanel;
    } catch {
      throw new Error("Failed to get review dashboard side panel");
    }
  }
}

export default ReviewDashboardAPIClient;
