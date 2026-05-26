import TeamMemberService from "../../services/implementations/teamMemberService";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";

const teamMemberService = new TeamMemberService();

const teamMemberResolvers = {
  Query: {
    teamMembers: async (): Promise<TeamMemberDTO[]> => {
      return teamMemberService.getTeamMembers();
    },
  },
  Mutation: {
    createTeamMember: async (
      _: unknown,
      { teamMember }: { teamMember: CreateTeamMemberDTO },
    ): Promise<TeamMemberDTO> => {
      return teamMemberService.createTeamMember(teamMember);
    },
  },
};

export default teamMemberResolvers;
