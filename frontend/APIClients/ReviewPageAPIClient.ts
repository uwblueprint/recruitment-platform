import { client } from "@/client";
import {
  type ApplicantRecordWithReviewersResult,
  ApplicationDocument,
  type ApplicationQuery,
  type ApplicationQueryVariables,
  type ApplicationResult,
  ReassignReviewerDocument,
  type ReassignReviewerMutation,
  type ReassignReviewerMutationVariables,
  type ReassignReviewerResult,
  ReportReviewConflictDocument,
  type ReportReviewConflictMutation,
  type ReportReviewConflictMutationVariables,
  type ReviewConflictReportResult,
  ReviewedApplicantRecordsByApplicantRecordIdDocument,
  type ReviewedApplicantRecordsByApplicantRecordIdQuery,
  type ReviewedApplicantRecordsByApplicantRecordIdQueryVariables,
  UsersByPositionDocument,
  type UsersByPositionQuery,
  type UsersByPositionQueryVariables,
  type UsersByPositionResult,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class ReviewPageAPIClient {
  static async getApplication(
    applicantRecordId: string,
  ): Promise<ApplicationResult> {
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
      throw new Error("Failed to fetch application");
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

  static async getReviewedApplicantRecordsByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<ApplicantRecordWithReviewersResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewedApplicantRecordsByApplicantRecordIdQuery,
        ReviewedApplicantRecordsByApplicantRecordIdQueryVariables
      >({
        query: ReviewedApplicantRecordsByApplicantRecordIdDocument,
        variables: { applicantRecordId },
        fetchPolicy: "network-only",
      });

      if (!data?.reviewedApplicantRecordsByApplicantRecordId) {
        throw new Error("No data returned");
      }

      return data.reviewedApplicantRecordsByApplicantRecordId;
    } catch {
      throw new Error("Failed to fetch reviewed applicant records");
    }
  }

  static async getUsersByPosition(
    position: string,
  ): Promise<UsersByPositionResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        UsersByPositionQuery,
        UsersByPositionQueryVariables
      >({
        query: UsersByPositionDocument,
        variables: { position },
        fetchPolicy: "network-only",
      });

      if (!data?.usersByPosition) {
        throw new Error("No data returned");
      }

      return data.usersByPosition;
    } catch {
      throw new Error(`Failed to fetch users with position ${position}`);
    }
  }

  static async reassignReviewer(
    applicantRecordId: string,
    oldReviewerId: string,
    newReviewerId: string,
  ): Promise<ReassignReviewerResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        ReassignReviewerMutation,
        ReassignReviewerMutationVariables
      >({
        mutation: ReassignReviewerDocument,
        variables: { applicantRecordId, oldReviewerId, newReviewerId },
      });

      if (!data?.reassignReviewer) {
        throw new Error("No data returned");
      }

      return data.reassignReviewer;
    } catch {
      throw new Error("Failed to reassign reviewer");
    }
  }
}

export default ReviewPageAPIClient;
