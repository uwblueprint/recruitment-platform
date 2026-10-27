import type { Member } from "./membersDashboard";

export type TeamMember = Member & {
  firstName?: string;
  lastName?: string;
  termsOnProject: string;
  avatarUrl?: string;
};

export type TeamStatus = "Active" | "Archived";

/** Temporary display types until the teams query is available. */
export type ManagementTeam = {
  id: string;
  name: string;
  status: TeamStatus;
  members: TeamMember[];
};

export type TeamsDashboardFilters = {
  search?: string;
  teams?: string[];
};
