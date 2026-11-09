import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  MembersDashboardDocument,
  type MembersDashboardResult,
} from "@/graphql/typeUtils";
import type {
  Member,
  MembersDashboardVariables,
} from "@/types/membersDashboard";

// school terms
const formatJoinedTerm = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const month = date.getMonth();
  const season = month <= 3 ? "Winter" : month <= 7 ? "Spring" : "Fall";
  return `${season} ${date.getFullYear()}`;
};

const toMember = (row: MembersDashboardResult): Member => ({
  id: row.id,
  name: `${row.firstName} ${row.lastName}`,
  role: row.role ?? "—",
  team: row.team ?? "Unassigned",
  joined: row.joined ? formatJoinedTerm(row.joined) : "—",
  status: row.isArchived ? "Not Active" : "Active",
});

export default function useMembersDashboard({
  pageNumber,
  resultsPerPage,
}: MembersDashboardVariables) {
  const { data, previousData, loading, error, refetch } = useQuery(
    MembersDashboardDocument,
    {
      variables: { pageNumber, resultsPerPage },
      fetchPolicy: "network-only",
      context: { refreshAuth: true },
    },
  );
  const rows = useMemo(() => data?.membersDashboard.map(toMember), [data]);
  const previousRows = useMemo(
    () => previousData?.membersDashboard.map(toMember),
    [previousData],
  );
  const queryError =
    error ??
    (!loading && !rows
      ? new Error("No membersDashboard data returned")
      : undefined);

  return {
    data: queryError ? undefined : rows,
    previousData: previousRows,
    loading,
    error: queryError,
    refetch,
  };
}
