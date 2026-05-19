import { client } from "@/client";  

import BaseAPIClient from "./BaseAPIClient";
import {
  InterviewGroupDocument,
  InterviewGroupDTO,
  UpdateInterviewGroupDocument,
  UpdateInterviewGroupDTO,
  type InterviewGroupQuery,
  type InterviewGroupQueryVariables,
  type UpdateInterviewGroupMutation,
  type UpdateInterviewGroupMutationVariables,
} from "@/graphql/typeUtils";

class InterviewGroupAPIClient {
  static async updateInterviewGroup(
    id: string,
    interviewGroup: UpdateInterviewGroupDTO,
  ): Promise<InterviewGroupDTO> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        UpdateInterviewGroupMutation,
        UpdateInterviewGroupMutationVariables
      >({
        mutation: UpdateInterviewGroupDocument,
        variables: { id, interviewGroup },
      });

      if (!data?.updateInterviewGroup) {
        throw new Error("No data returned");
      }

      return data.updateInterviewGroup;
    } catch {
      throw new Error("Failed to update interview group");
    }
  }

  static async getInterviewGroupById(
    id: string,
  ): Promise<InterviewGroupDTO> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewGroupQuery,
        InterviewGroupQueryVariables
      >({
        query: InterviewGroupDocument,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!data?.interviewGroup) {
        throw new Error("No data returned");
      }

      return data.interviewGroup;
    } catch {
      throw new Error("Failed to get interview group");
    }
  }
}

export default InterviewGroupAPIClient;
