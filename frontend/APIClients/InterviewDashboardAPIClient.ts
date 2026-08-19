import { client } from "@/client";
import {
  InterviewDashboardDocument,
  InterviewDashboardSidePanelDocument,
  InterviewNotesDocument,
  UpdateApplicantRecordIsApplicantFlaggedDocument,
  type InterviewDashboardQuery,
  type InterviewDashboardQueryVariables,
  type InterviewDashboardResult,
  type InterviewDashboardSidePanelQuery,
  type InterviewDashboardSidePanelQueryVariables,
  type InterviewDashboardSidePanelResult,
  type InterviewNotesQuery,
  type InterviewNotesQueryVariables,
  type InterviewNotesResult,
  type UpdateApplicantRecordIsApplicantFlaggedMutation,
  type UpdateApplicantRecordIsApplicantFlaggedMutationVariables,
  type UpdateApplicantRecordIsApplicantFlaggedResult,
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

  static async getInterviewNotes(
    fileId: string,
  ): Promise<InterviewNotesResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewNotesQuery,
        InterviewNotesQueryVariables
      >({
        query: InterviewNotesDocument,
        variables: { fileId },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewNotes) {
        throw new Error("No data returned");
      }

      return data.interviewNotes;
    } catch {
      throw new Error("Failed to get interview notes");
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
