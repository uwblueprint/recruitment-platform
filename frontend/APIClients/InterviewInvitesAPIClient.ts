import { client } from "@/client";
import {
  InterviewInvitesDocument,
  type InterviewInvitesQuery,
  type InterviewInvitesQueryVariables,
  type InterviewInviteResult,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class InterviewInvitesAPIClient {
  static async getInterviewInvites(): Promise<InterviewInviteResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        InterviewInvitesQuery,
        InterviewInvitesQueryVariables
      >({
        query: InterviewInvitesDocument,
        fetchPolicy: "network-only",
      });

      if (!data?.interviewInvites) {
        throw new Error("No data returned");
      }

      return data.interviewInvites;
    } catch (err) {
      console.error("[interviewInvites] underlying error:", err);
      throw new Error("Failed to get interview invites");
    }
  }
}

export default InterviewInvitesAPIClient;
