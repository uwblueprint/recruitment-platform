import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type { ReviewDashboardFilterOptionsResult } from "@/graphql/typeUtils";

type UseReviewDashboardFilterOptionsResult = {
  filterOptions: ReviewDashboardFilterOptionsResult | null;
  isLoading: boolean;
  error: boolean;
};

const useReviewDashboardFilterOptions = (
  department?: string,
): UseReviewDashboardFilterOptionsResult => {
  const [state, setState] = useState<UseReviewDashboardFilterOptionsResult>({
    filterOptions: null,
    isLoading: false,
    error: false,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: false }));

    ReviewDashboardAPIClient.getReviewDashboardFilterOptions(department)
      .then((filterOptions) => {
        setState({ filterOptions, isLoading: false, error: false });
      })
      .catch(() => {
        setState({ filterOptions: null, isLoading: false, error: true });
      });
  }, [department]);

  return state;
};

export default useReviewDashboardFilterOptions;
