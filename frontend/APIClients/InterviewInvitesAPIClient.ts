import { gql } from "@apollo/client";
import { client } from "@/client";
import type { InterviewInviteResult } from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

const INTERVIEW_INVITES_QUERY = gql`
  query InterviewInvites {
    interviewInvites {
      id
      interviewers {
        id
        firstName
        lastName
      }
      interviewees {
        firstName
        lastName
        position
      }
      position
      schedulingLink
      status
    }
  }
`;

class InterviewInvitesAPIClient {
  static async getInterviewInvites(): Promise<InterviewInviteResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query({
        query: INTERVIEW_INVITES_QUERY,
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
