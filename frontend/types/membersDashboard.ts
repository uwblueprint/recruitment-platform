/** Display-ready row; map the generated query result to this shape in the API hook. */
export type Member = {
  id: string;
  name: string;
  role: string;
  team: string;
  joined: string;
  status: string;
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
