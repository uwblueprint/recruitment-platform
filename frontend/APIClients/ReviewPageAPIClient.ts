import { client } from "@/client";
import {
  ApplicationDocument,
  ReportReviewConflictDocument,
  type ApplicationQuery,
  type ApplicationQueryVariables,
  type ApplicationDTO,
  type ReportReviewConflictMutation,
  type ReportReviewConflictMutationVariables,
  type ReviewConflictReportResult,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class ReviewPageAPIClient {
  static async getApplicationByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<ApplicationDTO> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ApplicationQuery,
        ApplicationQueryVariables
      >({
        query: ApplicationDocument,
        variables: { applicantRecordId },
        fetchPolicy: "network-only",
      });

      if (!data?.application) {
        throw new Error("No data returned");
      }

      return data.application;
    } catch {
      throw new Error("Failed to get application");
    }
  }

  static async reportReviewConflict(
    applicantRecordId: string,
    reviewerId: string,
  ): Promise<ReviewConflictReportResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        ReportReviewConflictMutation,
        ReportReviewConflictMutationVariables
      >({
        mutation: ReportReviewConflictDocument,
        variables: { applicantRecordId, reviewerId },
      });

      if (!data?.reportReviewConflict) {
        throw new Error("No data returned");
      }

      return data.reportReviewConflict;
    } catch {
      throw new Error("Failed to report review conflict");
    }
  }
}

export default ReviewPageAPIClient;
