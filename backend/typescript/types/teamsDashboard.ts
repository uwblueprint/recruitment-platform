export type TeamsDashboardMemberDTO = {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  joined: string | null;
  termsOnProject: string;
  isArchived: boolean;
};

export type TeamsDashboardTeamDTO = {
  id: string;
  projectName: string;
  isArchived: boolean;
  members: TeamsDashboardMemberDTO[];
};
