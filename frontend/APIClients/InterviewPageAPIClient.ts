import { client } from "@/client";

import BaseAPIClient from "./BaseAPIClient";
import {
  InterviewedApplicantsByUserIdDocument,
  InterviewersByGroupIdDocument,
  type InterviewedApplicantsByUserIdQuery,
  type InterviewedApplicantsByUserIdQueryVariables,
  type InterviewersByGroupIdQuery,
  type InterviewersByGroupIdQueryVariables,
  type InterviewedApplicantsDTO,
  type UserDTO,
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

  static async getInterviewersByGroupId(
    groupId: string,
  ): Promise<UserDTO[]> {
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
}

export default InterviewPageAPIClient;
