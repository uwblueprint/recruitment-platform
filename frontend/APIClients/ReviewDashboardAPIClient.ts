import { client } from "@/client";
import {
  ReviewDashboardDocument,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
  type ReviewDashboardResult,
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
}

export default ReviewDashboardAPIClient;
