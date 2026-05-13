import { client } from "@/client";
import type { InterviewGroupDTO, UpdateInterviewGroupDTO } from "@/types";

import BaseAPIClient from "./BaseAPIClient";
import {
  UPDATE_INTERVIEW_GROUP_MUTATION,
  GET_INTERVIEW_GROUP_BY_ID_QUERY,
} from "@/queries/interviewGroup";

type UpdateInterviewGroupData = {
  updateInterviewGroup: InterviewGroupDTO;
};

type GetInterviewGroupByIdData = {
  getInterviewGroupById: InterviewGroupDTO;
};

class InterviewGroupAPIClient {
  static async updateInterviewGroup(
    id: string,
    interviewGroup: UpdateInterviewGroupDTO,
  ): Promise<InterviewGroupDTO> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        UpdateInterviewGroupData,
        { id: string; interviewGroup: UpdateInterviewGroupDTO }
      >({
        mutation: UPDATE_INTERVIEW_GROUP_MUTATION,
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
        GetInterviewGroupByIdData,
        { id: string }
      >({
        query: GET_INTERVIEW_GROUP_BY_ID_QUERY,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!data?.getInterviewGroupById) {
        throw new Error("No data returned");
      }

      return data.getInterviewGroupById;
    } catch {
      throw new Error("Failed to get interview group");
    }
  }
}

export default InterviewGroupAPIClient;
