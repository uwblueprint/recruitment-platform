export type MembersDashboardRowDTO = {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  team: string | null;
  joined: string | null;
  isArchived: boolean;
};
