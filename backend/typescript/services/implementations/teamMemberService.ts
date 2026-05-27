import ITeamMemberService from "../interfaces/ITeamMemberService";
import logger from "../../utilities/logger";
import { CreateTeamMemberDTO, TeamMemberDTO } from "../../types";
import TeamMember from "../../models/teamMember.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import { toTeamMemberDTO } from "../../utilities/dtoUtils";

const Logger = logger(__filename);

class TeamMemberService implements ITeamMemberService {
  getTeamMembers = async (): Promise<TeamMemberDTO[]> => {
    try {
      const teamMembers = await TeamMember.findAll();
      return teamMembers.map(toTeamMemberDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get team members. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  };

  createTeamMember = async (
    teamMember: CreateTeamMemberDTO,
  ): Promise<TeamMemberDTO> => {
    try {
      const newTeamMember = await TeamMember.create({
        first_name: teamMember.firstName,
        last_name: teamMember.lastName,
        team_role: teamMember.teamRole,
      });
      return toTeamMemberDTO(newTeamMember);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create team member. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  };
}

export default TeamMemberService;
