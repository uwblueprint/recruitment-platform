import { ValueOf } from "../utilities/typingUtils";

export const TeamRoleEnum = {
  PM: "PM",
  DESIGNER: "DESIGNER",
  PL: "PL",
  DEVELOPER: "DEVELOPER",
} as const;

export type TeamRole = ValueOf<typeof TeamRoleEnum>;

// we use camel case for all non database types
export type TeamMemberDTO = {
  id: string;
  firstName: string;
  lastName: string;
  teamRole: TeamRole;
};

export type CreateTeamMemberDTO = Omit<TeamMemberDTO, "id">;
