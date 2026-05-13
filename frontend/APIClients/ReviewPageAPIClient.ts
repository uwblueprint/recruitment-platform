import { client } from "@/client";
import type { ReviewedApplicantRecordDTO } from "@/types";

import BaseAPIClient from "./BaseAPIClient";
import { REPORT_REVIEW_CONFLICT_MUTATION } from "@/queries/reviewPage";

type ReportReviewConflictData = {
  reportReviewConflict: ReviewedApplicantRecordDTO;
};

class ReviewPageAPIClient {
  static async reportReviewConflict(
    applicantRecordId: string,
    reviewerId: number,
  ): Promise<ReviewedApplicantRecordDTO> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        ReportReviewConflictData,
        { applicantRecordId: string; reviewerId: number }
      >({
        mutation: REPORT_REVIEW_CONFLICT_MUTATION,
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
