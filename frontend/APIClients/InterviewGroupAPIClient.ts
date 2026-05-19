import { client } from "@/client";  

import BaseAPIClient from "./BaseAPIClient";
import {
  InterviewGroupDocument,
  InterviewGroupDTO,
  UpdateInterviewGroupSchedulingLinkDocument,
  type InterviewGroupQuery,
  type InterviewGroupQueryVariables,
  type UpdateInterviewGroupSchedulingLinkMutation,
  type UpdateInterviewGroupSchedulingLinkMutationVariables,
} from "@/graphql/typeUtils";

class InterviewGroupAPIClient {
  static async updateInterviewGroupSchedulingLink(
    id: string,
    schedulingLink: string,
  ): Promise<InterviewGroupDTO> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        UpdateInterviewGroupSchedulingLinkMutation,
        UpdateInterviewGroupSchedulingLinkMutationVariables
      >({
        mutation: UpdateInterviewGroupSchedulingLinkDocument,
        variables: { id, schedulingLink },
      });

      if (!data?.updateInterviewGroupSchedulingLink) {
        throw new Error("No data returned");
      }

      return data.updateInterviewGroupSchedulingLink;
    } catch {
      throw new Error("Failed to update interview group scheduling link");
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
