import TeamMember from "../../models/teamMember.model";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class TeamMemberService {
  /* eslint-disable class-methods-use-this */
  async getTeamMembers(): Promise<TeamMemberDTO[]> {
    try {
      const teamMembers: Array<TeamMember> = await TeamMember.findAll();
      return teamMembers.map((member) => ({
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        teamRole: member.team_role,
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get team members. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createTeamMember(
    teamMember: CreateTeamMemberDTO,
  ): Promise<TeamMemberDTO> {
    try {
      const newTeamMember = await TeamMember.create({
        first_name: teamMember.firstName,
        last_name: teamMember.lastName,
        team_role: teamMember.teamRole,
      });
      return {
        id: newTeamMember.id,
        firstName: newTeamMember.first_name,
        lastName: newTeamMember.last_name,
        teamRole: newTeamMember.team_role,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to create team member. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default TeamMemberService;
