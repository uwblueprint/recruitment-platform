import { client } from "@/client";

import BaseAPIClient from "./BaseAPIClient";
import {
  CreateTeamMemberDocument,
  TeamMembersDocument,
  type CreateTeamMemberDTO,
  type CreateTeamMemberMutation,
  type CreateTeamMemberMutationVariables,
  type TeamMemberDTO,
  type TeamMembersQuery,
  type TeamMembersQueryVariables,
} from "@/graphql/typeUtils";

class TeamMemberAPIClient {
  static async getTeamMembers(): Promise<TeamMemberDTO[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        TeamMembersQuery,
        TeamMembersQueryVariables
      >({
        query: TeamMembersDocument,
        fetchPolicy: "network-only",
      });

      if (!data?.teamMembers) {
        throw new Error("No data returned");
      }

      return data.teamMembers;
    } catch {
      throw new Error("Failed to get team members");
    }
  }

  static async createTeamMember(
    teamMember: CreateTeamMemberDTO,
  ): Promise<TeamMemberDTO> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        CreateTeamMemberMutation,
        CreateTeamMemberMutationVariables
      >({
        mutation: CreateTeamMemberDocument,
        variables: { teamMember },
      });

      if (!data?.createTeamMember) {
        throw new Error("No data returned");
      }

      return data.createTeamMember;
    } catch {
      throw new Error("Failed to create team member");
    }
  }
}

export default TeamMemberAPIClient;
