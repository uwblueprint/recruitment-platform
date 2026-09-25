import { useCallback, useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type {
  DashboardView,
  ReviewDashboardFilters,
  ReviewDashboardResult,
  ReviewDashboardSortBy,
} from "@/graphql/typeUtils";

type UseReviewDashboardResult = {
  rows: ReviewDashboardResult[];
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
};

const useReviewDashboard = (
  pageNumber: number,
  resultsPerPage: number,
  sortBy?: ReviewDashboardSortBy,
  sortAscending?: boolean,
  filters?: ReviewDashboardFilters,
  view?: DashboardView,
): UseReviewDashboardResult => {
  const [state, setState] = useState<Omit<UseReviewDashboardResult, "refetch">>({
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

  return {
    ...state,
    refetch,
  };
};

export default useReviewDashboard;
