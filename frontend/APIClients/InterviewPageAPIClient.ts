import { client } from "@/client";

import BaseAPIClient from "./BaseAPIClient";
import {
  InterviewedApplicantsByUserIdDocument,
  InterviewedPairingsByUserIdDocument,
  InterviewersByGroupIdDocument,
  type InterviewedApplicantsByUserIdQuery,
  type InterviewedApplicantsByUserIdQueryVariables,
  type InterviewedPairingsByUserIdQuery,
  type InterviewedPairingsByUserIdQueryVariables,
  type InterviewersByGroupIdQuery,
  type InterviewersByGroupIdQueryVariables,
  type InterviewedApplicantsDTO,
  type InterviewPairingResult,
  type UserDTO,
  type ReportInterviewConflictMutation,
  type ReportInterviewConflictMutationVariables,
  InterviewConflict,
  ReportInterviewConflictResult,
  ReportInterviewConflictDocument,
} from "@/graphql/typeUtils";

class InterviewPageAPIClient {
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
  ): Promise<InterviewPairingResult[]> {
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

  static async getInterviewersByGroupId(groupId: string): Promise<UserDTO[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewersByGroupIdQuery,
        InterviewersByGroupIdQueryVariables
      >({
        query: InterviewersByGroupIdDocument,
        variables: { groupId },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewersByGroupId) {
        throw new Error("No data returned");
      }

      return data.interviewersByGroupId;
    } catch {
      throw new Error("Failed to get interviewers by group id");
    }
  }

  static async reportInterviewConflict(
    interviewedApplicantRecordId: string,
    interviewerId: string,
    interviewHasConflict: InterviewConflict,
  ): Promise<ReportInterviewConflictResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        ReportInterviewConflictMutation,
        ReportInterviewConflictMutationVariables
      >({
        mutation: ReportInterviewConflictDocument,
        variables: {
          interviewedApplicantRecordId,
          interviewerId,
          interviewHasConflict,
        },
      });

      if (!data?.reportInterviewConflict) {
        throw new Error("No data returned");
      }
      return data.reportInterviewConflict;
    } catch {
      throw new Error("Failed to report interview conflict");
    }
  }
}

export default InterviewPageAPIClient;
