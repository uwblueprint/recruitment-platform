import TeamMember from "../models/teamMember.model";
import { ValueOf } from "../utilities/typingUtils";

export const TeamRoleEnum = {
  PM: "PM",
  DESIGNER: "DESIGNER",
  PL: "PL",
  DEVELOPER: "DEVELOPER",
} as const;

export type TeamRole = ValueOf<typeof TeamRoleEnum>;

export type TeamMemberDTO = {
  id: string;
  firstName: string;
  lastName: string;
  teamRole: TeamRole;
};

export type CreateTeamMemberDTO = Omit<TeamMemberDTO, "id">;

export const toTeamMemberDTO = (teamMember: TeamMember): TeamMemberDTO => {
  return {
    id: teamMember.id,
    firstName: teamMember.first_name,
    lastName: teamMember.last_name,
    teamRole: teamMember.team_role,
  };
};
