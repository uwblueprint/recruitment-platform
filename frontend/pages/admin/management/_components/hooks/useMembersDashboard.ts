import { useCallback } from "react";
import useMembersDashboardData from "@/APIClients/queries/useMembersDashboard";
import type { MembersDashboardFilters } from "@/types/membersDashboard";

export default function useMembersDashboard(
  pageNumber: number,
  resultsPerPage: number,
  filters?: MembersDashboardFilters
) {
  const {
    data,
    previousData,
    loading,
    error,
    refetch: refetchQuery,
  } = useMembersDashboardData({ pageNumber, resultsPerPage, filters });
  const refetch = useCallback(() => {
    // Apollo exposes failures through error; callers fire and forget.
    void refetchQuery().catch(() => {});
  }, [refetchQuery]);
  const hasError = !!error || (!loading && !data);

  return {
    rows: hasError ? [] : data ?? (loading ? previousData : undefined) ?? [],
    isLoading: loading,
    error: hasError,
    refetch,
  };
}
