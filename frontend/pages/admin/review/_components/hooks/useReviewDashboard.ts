import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";

type UseReviewDashboardResult = {
  rows: ReviewDashboardResult[];
  isLoading: boolean;
  error: boolean;
};

const useReviewDashboard = (
  pageNumber: number,
  resultsPerPage: number,
): UseReviewDashboardResult => {
  const [state, setState] = useState<UseReviewDashboardResult>({
    rows: [],
    isLoading: false,
    error: false,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: false }));

    ReviewDashboardAPIClient.getReviewDashboard(pageNumber, resultsPerPage)
      .then((rows) => {
        setState({ rows, isLoading: false, error: false });
      })
      .catch(() => {
        setState({ rows: [], isLoading: false, error: true });
      });
  }, [pageNumber, resultsPerPage]);

  return state;
};

export default useReviewDashboard;
