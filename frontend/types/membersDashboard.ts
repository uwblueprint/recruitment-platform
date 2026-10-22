import type { FilterOption } from "@/components/dashboard/filters";

/** Display-ready row; map the generated query result to this shape in the API hook. */
export type Member = {
  id: string;
  name: string;
  role: string;
  team: string;
  joined: string;
  status: string;
};

export type MemberSidePanelDetails = Member & {
  pastTeams: { team: string; role: string; term: string }[];
};

/** Temporary query types until the members GraphQL operation is generated. */
export type MembersDashboardFilters = {
  search?: string;
  roles?: string[];
  teams?: string[];
  statuses?: string[];
};

export type MembersDashboardVariables = {
  pageNumber: number;
  resultsPerPage: number;
  filters?: MembersDashboardFilters;
};

/** Fields supported by member updates and their dropdown options. */
export type MemberEditableField = keyof Pick<
  Member,
  "role" | "team" | "status"
>;
export type MemberUpdates = Partial<Pick<Member, MemberEditableField>>;

export type MembersDashboardFilterOptions = Record<
  "roles" | "teams" | "statuses",
  FilterOption[]
>;
