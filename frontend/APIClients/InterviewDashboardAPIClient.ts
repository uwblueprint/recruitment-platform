import { client } from "@/client";
import {
  InterviewDashboardDocument,
  type InterviewDashboardQuery,
  type InterviewDashboardQueryVariables,
  type InterviewDashboardResult,
  type InterviewDashboardSortBy,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class InterviewDashboardAPIClient {
  static async getInterviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
    sortBy?: InterviewDashboardSortBy,
    sortAscending?: boolean,
  ): Promise<InterviewDashboardResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewDashboardQuery,
        InterviewDashboardQueryVariables
      >({
        query: InterviewDashboardDocument,
        variables: { pageNumber, resultsPerPage, sortBy, sortAscending },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewDashboard) {
        throw new Error("No data returned");
      }

      return data.interviewDashboard;
    } catch {
      throw new Error("Failed to get interview dashboard");
    }
  }
}

export default InterviewDashboardAPIClient;
