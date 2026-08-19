import { useCallback, useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type {
  ApplicationStatus,
  ReviewDashboardResult,
  ReviewDashboardSortBy,
} from "@/graphql/typeUtils";

type ReviewDashboardState = {
  rows: ReviewDashboardResult[];
  isLoading: boolean;
  error: boolean;
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
): UseReviewDashboardResult => {
  const [state, setState] = useState<ReviewDashboardState>({
    rows: [],
    isLoading: false,
    error: false,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isLoading: true, error: false }));

    ReviewDashboardAPIClient.getReviewDashboard(
      pageNumber,
      resultsPerPage,
      sortBy,
      sortAscending,
    )
      .then((rows) => {
        setState({ rows, isLoading: false, error: false });
      })
      .catch(() => {
        setState({ rows: [], isLoading: false, error: true });
      });
  }, [pageNumber, resultsPerPage, sortBy, sortAscending]);

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

  return { ...state, setRowStatus };
};

export default useReviewDashboard;
