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

const formatJoined = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

const toMember = (row: MembersDashboardResult): Member => ({
  id: row.id,
  name: `${row.firstName} ${row.lastName}`,
  role: row.role ?? "—",
  team: row.team ?? "Unassigned",
  joined: row.joined ? formatJoined(row.joined) : "—",
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
