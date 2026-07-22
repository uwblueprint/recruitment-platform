import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type {
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
): UseReviewDashboardResult => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState<Omit<UseReviewDashboardResult, "refetch">>({
    rows: [],
    isLoading: false,
    error: false,
  });

  useEffect(() => {
    let ignore = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isLoading: true, error: false }));

    ReviewDashboardAPIClient.getReviewDashboard(
      pageNumber,
      resultsPerPage,
      sortBy,
      sortAscending,
    )
      .then((rows) => {
        if (!ignore) {
          setState({ rows, isLoading: false, error: false });
        }
      })
      .catch(() => {
        if (!ignore) {
          setState({ rows: [], isLoading: false, error: true });
        }
      });

    return () => {
      ignore = true;
    };
  }, [pageNumber, resultsPerPage, sortBy, sortAscending, refreshKey]);

  return { ...state, refetch: () => setRefreshKey((key) => key + 1) };
};

export default useReviewDashboard;
