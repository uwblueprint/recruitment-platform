import { client } from "@/client";
import {
  ApplicationStatus,
  BulkUpdateApplicantRecordsStatusDocument,
  ReviewDashboardDocument,
  UpdateApplicantRecordStatusDocument,
  type BulkUpdateApplicantRecordsStatusMutation,
  type BulkUpdateApplicantRecordsStatusMutationVariables,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
  type ReviewDashboardResult,
  type ReviewDashboardSortBy,
  type UpdateApplicantRecordStatusMutation,
  type UpdateApplicantRecordStatusMutationVariables,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class ReviewDashboardAPIClient {
  static async getReviewDashboard(
    pageNumber: number,
    resultsPerPage: number,
    sortBy?: ReviewDashboardSortBy,
    sortAscending?: boolean,
  ): Promise<ReviewDashboardResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewDashboardQuery,
        ReviewDashboardQueryVariables
      >({
        query: ReviewDashboardDocument,
        variables: { pageNumber, resultsPerPage, sortBy, sortAscending },
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
