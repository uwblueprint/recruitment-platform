import { useCallback, useEffect, useState } from "react";
import { useCallback, useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type {
  ApplicationStatus,
  DashboardView,
  ReviewDashboardFilters,
  ReviewDashboardResult,
  ReviewDashboardSortBy,
} from "@/graphql/typeUtils";
import { ReviewDashboardDocument } from "@/graphql/typeUtils";

type ReviewDashboardState = {
  rows: ReviewDashboardResult[];
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
};

type UseReviewDashboardResult = ReviewDashboardState & {
  /**
   * Patches the status of a single already-fetched row. The dashboard owns the
   * rows in local state, so the table and the side panel both read the new
   * value immediately without waiting for a refetch. Every fetch replaces
   * `rows` wholesale, so server truth wins the moment the page or sort
   * changes.
   */
  setRowStatus: (applicantRecordId: string, status: ApplicationStatus) => void;
};

type UseReviewDashboardResult = ReviewDashboardState & {
  /**
   * Patches the status of a single already-fetched row. The dashboard owns the
   * rows in local state, so the table and the side panel both read the new
   * value immediately without waiting for a refetch. Every fetch replaces
   * `rows` wholesale, so server truth wins the moment the page or sort
   * changes.
   */
  setRowStatus: (applicantRecordId: string, status: ApplicationStatus) => void;
};

const useReviewDashboard = (
  pageNumber: number,
  resultsPerPage: number,
  sortBy?: ReviewDashboardSortBy,
  sortAscending?: boolean,
  filters?: ReviewDashboardFilters,
  view?: DashboardView,
): UseReviewDashboardResult => {
  const [state, setState] = useState<Omit<ReviewDashboardState, "refetch">>({
    rows: [],
    isLoading: true,
    error: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const refetch = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((previous) => ({ ...previous, isLoading: true, error: false }));

    ReviewDashboardAPIClient.getReviewDashboard(
      pageNumber,
      resultsPerPage,
      sortBy,
      sortAscending,
      filters,
      view,
    )
      .then((rows) => {
        if (isCurrent) {
          setState({ rows, isLoading: false, error: false });
        }
      })
      .catch(() => {
        if (isCurrent) {
          setState({ rows: [], isLoading: false, error: true });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [pageNumber, resultsPerPage, sortBy, sortAscending, filters, view, refreshKey]);

  // Stable across renders so callers can build memoized column definitions
  // on top of it.
  const setRowStatus = useCallback(
    (applicantRecordId: string, status: ApplicationStatus) => {
      setState((prev) => ({
        ...prev,
        rows: prev.rows.map((row) =>
          row.applicantRecordId === applicantRecordId
            ? { ...row, applicationStatus: status }
            : row,
        ),
      }));
    },
    [],
  );

  return { ...{
    ...state, setRowStatus },
    refetch,
  };
};

export default useReviewDashboard;
