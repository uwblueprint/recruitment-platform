import { client } from "@/client";
import type { UserDTO, InterviewedApplicantsDTO } from "@/types";

import BaseAPIClient from "./BaseAPIClient";
import {
  GET_INTERVIEWED_APPLICANTS_BY_USER_ID,
  GET_INTERVIEWERS_BY_GROUP_ID,
} from "@/queries/interviewPage";

type GetInterviewedApplicantsByUserIdData = {
  getInterviewedApplicantsByUserId: InterviewedApplicantsDTO[];
};

type GetInterviewersByGroupIdData = {
  getInterviewersByGroupId: UserDTO[];
};

class InterviewPageAPIClient {
  static async getInterviewedApplicantsByUserId(
    userId: number,
  ): Promise<InterviewedApplicantsDTO[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        GetInterviewedApplicantsByUserIdData,
        { userId: number }
      >({
        query: GET_INTERVIEWED_APPLICANTS_BY_USER_ID,
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
        GetInterviewersByGroupIdData,
        { groupId: string }
      >({
        query: GET_INTERVIEWERS_BY_GROUP_ID,
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
