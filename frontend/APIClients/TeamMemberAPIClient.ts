import { client } from "@/client";
import {
  CreateTeamMemberDto,
  TeamMemberDto,
} from "@/graphql/__generated__/types";
import {
  CreateTeamMemberDocument,
  CreateTeamMemberMutation,
  CreateTeamMemberMutationVariables,
  TeamMembersDocument,
  TeamMembersQuery,
  TeamMembersQueryVariables,
} from "@/graphql/typeUtils";
import BaseAPIClient from "./BaseAPIClient";

class TeamMemberAPIClient {
  static async getTeamMembers(): Promise<TeamMemberDto[]> {
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
    teamMember: CreateTeamMemberDto,
  ): Promise<TeamMemberDto> {
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
