import { client } from "@/client";

import BaseAPIClient from "./BaseAPIClient";
import {
  GetInterviewedApplicantsByUserIdDocument,
  GetInterviewersByGroupIdDocument,
  type GetInterviewedApplicantsByUserIdQuery,
  type GetInterviewedApplicantsByUserIdQueryVariables,
  type GetInterviewersByGroupIdQuery,
  type GetInterviewersByGroupIdQueryVariables,
  type InterviewedApplicantsDTO,
  type UserDTO,
} from "@/graphql/typeUtils";

class InterviewPageAPIClient {
  static async getInterviewedApplicantsByUserId(
    userId: number,
  ): Promise<InterviewedApplicantsDTO[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        GetInterviewedApplicantsByUserIdQuery,
        GetInterviewedApplicantsByUserIdQueryVariables
      >({
        query: GetInterviewedApplicantsByUserIdDocument,
        variables: { userId },
        fetchPolicy: "network-only",
      });

      if (!data?.getInterviewedApplicantsByUserId) {
        throw new Error("No data returned");
      }

      return data.getInterviewedApplicantsByUserId;
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
        GetInterviewersByGroupIdQuery,
        GetInterviewersByGroupIdQueryVariables
      >({
        query: GetInterviewersByGroupIdDocument,
        variables: { groupId },
        fetchPolicy: "network-only",
      });

      if (!data?.getInterviewersByGroupId) {
        throw new Error("No data returned");
      }

      return data.getInterviewersByGroupId;
    } catch {
      throw new Error("Failed to get interviewers by group id");
    }
  }
}

export default InterviewPageAPIClient;
