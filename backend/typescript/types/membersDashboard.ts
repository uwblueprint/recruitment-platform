import UserTermRecord from "../models/userTermRecord.model";

export type MembersDashboardRowDTO = {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  team: string | null;
  joined: string | null;
  isArchived: boolean;
};

export type MembersDashboardSidePanelDTO = {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  team: string | null;
  joined: string | null;
  isArchived: boolean;
  pastTeams: UserTermRecord[];
};
