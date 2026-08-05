import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import { DashboardView } from "@/graphql/typeUtils";
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
  view?: DashboardView,
): UseReviewDashboardResult => {
  const [state, setState] = useState<Omit<UseReviewDashboardResult, "refetch">>({
    rows: [],
    isLoading: false,
    error: false,
  });
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isLoading: true, error: false }));
    ReviewDashboardAPIClient.getReviewDashboard(
      pageNumber,
      resultsPerPage,
      sortBy,
      sortAscending,
      view,
    )
      .then((rows) => {
        setState({ rows, isLoading: false, error: false });
      })
      .catch(() => {
        setState({ rows: [], isLoading: false, error: true });
      });
  }, [pageNumber, resultsPerPage, sortBy, sortAscending, view, fetchCount]);

  return {
    ...state,
    refetch: () => setFetchCount((c) => c + 1),
  };
};

export default useReviewDashboard;
