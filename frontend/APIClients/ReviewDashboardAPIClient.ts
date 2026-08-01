import { client } from "@/client";
import {
  ReviewDashboardApplicantRecordIdsDocument,
  ReviewDashboardDocument,
  ReviewDashboardSidePanelDocument,
  type ReviewDashboardApplicantRecordIdsQuery,
  type ReviewDashboardApplicantRecordIdsQueryVariables,
  ApplicationStatus,
  UpdateApplicantRecordStatusDocument,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
  type ReviewDashboardResult,
  type ReviewDashboardSidePanelQuery,
  type ReviewDashboardSidePanelQueryVariables,
  type ReviewDashboardSidePanelResult,
  type ReviewDashboardSortBy,
  type UpdateApplicantRecordStatusMutation,
  type UpdateApplicantRecordStatusMutationVariables,
  ReviewDashboardFilterOptionsDocument,
  type ReviewDashboardFilterOptionsQuery,
  type ReviewDashboardFilterOptionsQueryVariables,
  type ReviewDashboardFilterOptionsResult,
  type ReviewDashboardFilters,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class ReviewDashboardAPIClient {
  static async getReviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
    sortBy?: ReviewDashboardSortBy,
    sortAscending?: boolean,
    filters?: ReviewDashboardFilters,
  ): Promise<ReviewDashboardResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardQuery,
        ReviewDashboardQueryVariables
      >({
        query: ReviewDashboardDocument,
        variables: { pageNumber, resultsPerPage, sortBy, sortAscending, filters },
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

  static async getReviewDashboardFilterOptions(
    department?: string,
  ): Promise<ReviewDashboardFilterOptionsResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardFilterOptionsQuery,
        ReviewDashboardFilterOptionsQueryVariables
      >({
        query: ReviewDashboardFilterOptionsDocument,
        variables: { department },
        fetchPolicy: "network-only",
      });

      if (!data?.reviewDashboardFilterOptions) {
        throw new Error("No data returned");
      }

      return data.reviewDashboardFilterOptions;
    } catch {
      throw new Error("Failed to get review dashboard filter options");
    }
  }

  static async getReviewDashboardApplicantRecordIds(): Promise<string[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardApplicantRecordIdsQuery,
        ReviewDashboardApplicantRecordIdsQueryVariables
      >({
        query: ReviewDashboardApplicantRecordIdsDocument,
        variables: {},
        fetchPolicy: "network-only",
      });

      if (!data?.reviewDashboardApplicantRecordIds) {
        throw new Error("No data returned");
      }

      return data.reviewDashboardApplicantRecordIds;
    } catch {
      throw new Error("Failed to get review dashboard applicant record ids");
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

  static async updateApplicantRecordStatus(
    id: string,
    status: ApplicationStatus,
  ): Promise<ApplicationStatus> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        UpdateApplicantRecordStatusMutation,
        UpdateApplicantRecordStatusMutationVariables
      >({
        mutation: UpdateApplicantRecordStatusDocument,
        variables: { id, status },
      });

      const updatedStatus = data?.updateApplicantRecordStatus?.status;
      if (!updatedStatus) {
        throw new Error("No status returned");
      }
      return updatedStatus;
    } catch {
      throw new Error("Failed to update applicant status");
    }
  }
}

export default ReviewDashboardAPIClient;
