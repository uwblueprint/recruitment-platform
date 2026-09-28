import { client } from "@/client";
import BaseAPIClient from "./BaseAPIClient";
import {
  InterviewedApplicantsByUserIdDocument,
  InterviewedPairingsByUserIdDocument,
  ReviewedApplicantsByUserIdDocument,
  type InterviewedApplicantsByUserIdQuery,
  type InterviewedApplicantsByUserIdQueryVariables,
  type InterviewedApplicantsDTO,
  type InterviewedPairingResult,
  type InterviewedPairingsByUserIdQuery,
  type InterviewedPairingsByUserIdQueryVariables,
  type ReviewedApplicantResult,
  type ReviewedApplicantsByUserIdQuery,
  type ReviewedApplicantsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

class HomeAPIClient {
  static async getReviewedApplicantsByUserId(
    userId: string,
  ): Promise<ReviewedApplicantResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        ReviewedApplicantsByUserIdQuery,
        ReviewedApplicantsByUserIdQueryVariables
      >({
        query: ReviewedApplicantsByUserIdDocument,
        variables: { userId },
        fetchPolicy: "network-only",
      });

      if (!data?.reviewedApplicantsByUserId) {
        throw new Error("No data returned");
      }

      return data.reviewedApplicantsByUserId;
    } catch {
      throw new Error("Failed to get reviewed applicants");
    }
  }

  static async getInterviewedApplicantsByUserId(
    userId: string,
  ): Promise<InterviewedApplicantsDTO[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewedApplicantsByUserIdQuery,
        InterviewedApplicantsByUserIdQueryVariables
      >({
        query: InterviewedApplicantsByUserIdDocument,
        variables: { userId },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewedApplicantsByUserId) {
        throw new Error("No data returned");
      }

      return data.interviewedApplicantsByUserId;
    } catch {
      throw new Error("Failed to get interviewed applicants");
    }
  }

  static async getInterviewedPairingsByUserId(
    userId: string,
  ): Promise<InterviewedPairingResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewedPairingsByUserIdQuery,
        InterviewedPairingsByUserIdQueryVariables
      >({
        query: InterviewedPairingsByUserIdDocument,
        variables: { userId },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewedPairingsByUserId) {
        throw new Error("No data returned");
      }

      return data.interviewedPairingsByUserId;
    } catch {
      throw new Error("Failed to get interviewed pairings");
    }
  }
}

export default HomeAPIClient;
