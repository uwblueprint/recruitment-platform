import { client } from "@/client";
import {
  InterviewDashboardDocument,
  type InterviewDashboardQuery,
  type InterviewDashboardQueryVariables,
  type InterviewDashboardResult,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class InterviewDashboardAPIClient {
  static async getInterviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
  ): Promise<InterviewDashboardResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewDashboardQuery,
        InterviewDashboardQueryVariables
      >({
        query: InterviewDashboardDocument,
        variables: { pageNumber, resultsPerPage },
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
