import { client } from "@/client";
import {
  ReportReviewConflictDocument,
  type ReportReviewConflictMutation,
  type ReportReviewConflictMutationVariables,
  type ReviewConflictReportResult,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class ReviewPageAPIClient {
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
