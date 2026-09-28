import { useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import {
  ReviewDashboardDocument,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
  type ApplicationStatus,
  type DashboardView,
  type ReviewDashboardFilters,
  type ReviewDashboardResult,
  type ReviewDashboardSortBy,
} from "@/graphql/typeUtils";

type ReviewDashboardState = {
  rows: ReviewDashboardResult[];
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
};

type UseReviewDashboardResult = ReviewDashboardState & {
  /**
   * Patches the status of an already-fetched row in Apollo's query cache so
   * the table and side panel update immediately. A network fetch replaces
   * these values with server data.
   */
  setRowStatus: (applicantRecordId: string, status: ApplicationStatus) => void;
};

const useReviewDashboard = (
  pageNumber: number,
  resultsPerPage: number,
  sortBy?: ReviewDashboardSortBy,
  sortAscending?: boolean,
  filters?: ReviewDashboardFilters,
  view?: DashboardView
): UseReviewDashboardResult => {
  const {
    data,
    previousData,
    loading,
    error,
    refetch: refetchQuery,
    updateQuery,
  } = useQuery<ReviewDashboardQuery, ReviewDashboardQueryVariables>(
    ReviewDashboardDocument,
    {
      variables: {
        pageNumber,
        resultsPerPage,
        sortBy,
        sortAscending,
        filters,
        view,
      },
      fetchPolicy: "network-only",
      context: { refreshAuth: true },
    }
  );

  const refetch = useCallback(() => {
    // Apollo exposes failures through `error`; callers fire and forget.
    void refetchQuery().catch(() => {});
  }, [refetchQuery]);

  // Stable across renders so callers can build memoized column definitions.
  const setRowStatus = useCallback(
    (applicantRecordId: string, status: ApplicationStatus) => {
      updateQuery((_, { complete, previousData: previous }) => {
        if (!complete) return;
        return {
          ...previous,
          reviewDashboard: previous.reviewDashboard.map((row) =>
            row.applicantRecordId === applicantRecordId
              ? { ...row, applicationStatus: status }
              : row
          ),
        };
      });
    },
    [updateQuery]
  );

  const rows = data?.reviewDashboard;
  const hasError = !!error || (!loading && !rows);

  return {
    rows: hasError
      ? []
      : rows ?? (loading ? previousData?.reviewDashboard : undefined) ?? [],
    isLoading: loading,
    error: hasError,
    setRowStatus,
    refetch,
  };
};

export default useReviewDashboard;
