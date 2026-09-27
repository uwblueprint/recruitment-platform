import { client } from "@/client";
import {
  InterviewDashboardDocument,
  InterviewDashboardSidePanelDocument,
  UpdateApplicantRecordIsApplicantFlaggedDocument,
  type InterviewDashboardQuery,
  type InterviewDashboardQueryVariables,
  type InterviewDashboardResult,
  type InterviewDashboardSidePanelQuery,
  type InterviewDashboardSidePanelQueryVariables,
  type InterviewDashboardSidePanelResult,
  type UpdateApplicantRecordIsApplicantFlaggedMutation,
  type UpdateApplicantRecordIsApplicantFlaggedMutationVariables,
  type UpdateApplicantRecordIsApplicantFlaggedResult,
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
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("getInterviewDashboard error:", e);
      throw new Error("Failed to get interview dashboard");
    }
  }

  static async getInterviewDashboardSidePanel(
    applicantRecordId: string,
  ): Promise<InterviewDashboardSidePanelResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewDashboardSidePanelQuery,
        InterviewDashboardSidePanelQueryVariables
      >({
        query: InterviewDashboardSidePanelDocument,
        variables: { applicantRecordId },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewDashboardSidePanel) {
        throw new Error("No data returned");
      }

      return data.interviewDashboardSidePanel;
    } catch {
      throw new Error("Failed to get interview dashboard side panel");
    }
  }

  static async updateApplicantRecordIsApplicantFlagged(
    id: string,
    flagValue: boolean,
  ): Promise<UpdateApplicantRecordIsApplicantFlaggedResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        UpdateApplicantRecordIsApplicantFlaggedMutation,
        UpdateApplicantRecordIsApplicantFlaggedMutationVariables
      >({
        mutation: UpdateApplicantRecordIsApplicantFlaggedDocument,
        variables: { id, flagValue },
      });

      if (!data?.updateApplicantRecordIsApplicantFlagged) {
        throw new Error("No data returned");
      }

      return data.updateApplicantRecordIsApplicantFlagged;
    } catch {
      throw new Error("Failed to update applicant bookmark");
    }
  }
}

export default InterviewDashboardAPIClient;
