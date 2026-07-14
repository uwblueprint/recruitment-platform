import { client } from "@/client";
import {
  ApplicationStatus,
  ReviewDashboardDocument,
  UpdateApplicantRecordStatusDocument,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
  type ReviewDashboardResult,
  type UpdateApplicantRecordStatusMutation,
  type UpdateApplicantRecordStatusMutationVariables,
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
