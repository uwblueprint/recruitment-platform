export type MembersDashboardRowDTO = {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  team: string | null;
  joined: string | null;
  isArchived: boolean;
};

export type MemberPastTeamDTO = {
  team: string | null;
  role: string;
  term: string;
};

export type MembersDashboardSidePanelDTO = MembersDashboardRowDTO & {
  pastTeams: MemberPastTeamDTO[];
};
