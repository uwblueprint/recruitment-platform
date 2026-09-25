import { client } from "@/client";
import {
  DashboardView,
  ReviewDashboardApplicantRecordIdsDocument,
  BulkUpdateApplicantRecordsStatusDocument,
  ReviewDashboardDocument,
  ReviewDashboardSidePanelDocument,
  type ReviewDashboardApplicantRecordIdsQuery,
  type ReviewDashboardApplicantRecordIdsQueryVariables,
  ApplicationStatus,
  UpdateApplicantRecordStatusDocument,
  type BulkUpdateApplicantRecordsStatusMutation,
  type BulkUpdateApplicantRecordsStatusMutationVariables,
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
    view?: DashboardView,
  ): Promise<ReviewDashboardResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardQuery,
        ReviewDashboardQueryVariables
      >({
        query: ReviewDashboardDocument,
        variables: {
          pageNumber,
          resultsPerPage,
          sortBy,
          sortAscending,
          filters,
          view,
        },
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

  static async bulkUpdateApplicantRecordsStatus(
    ids: string[],
    status: ApplicationStatus,
  ): Promise<void> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const uniqueIds = [...new Set(ids)];
      const { data } = await client.mutate<
        BulkUpdateApplicantRecordsStatusMutation,
        BulkUpdateApplicantRecordsStatusMutationVariables
      >({
        mutation: BulkUpdateApplicantRecordsStatusDocument,
        variables: { ids: uniqueIds, status },
      });

      const updatedRecords = data?.bulkUpdateApplicantRecordsStatus;
      const updatedById = new Map(
        updatedRecords?.map((record) => [record.id, record.status]),
      );
      const allUpdated =
        updatedRecords?.length === uniqueIds.length &&
        uniqueIds.every((id) => updatedById.get(id) === status);

      if (!allUpdated) {
        throw new Error("Not all applicant statuses were updated");
      }
    } catch {
      throw new Error("Failed to update applicant statuses");
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

  static async getReviewDashboardApplicantRecordIds(
    sortBy?: ReviewDashboardSortBy,
    sortAscending?: boolean,
    filters?: ReviewDashboardFilters,
  ): Promise<string[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardApplicantRecordIdsQuery,
        ReviewDashboardApplicantRecordIdsQueryVariables
      >({
        query: ReviewDashboardApplicantRecordIdsDocument,
        variables: { sortBy, sortAscending, filters },
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
