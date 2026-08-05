import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import { DashboardView } from "@/graphql/typeUtils";
import type {
  ReviewDashboardResult,
  ReviewDashboardSortBy,
  ReviewDashboardQuery,
  ReviewDashboardQueryVariables,
} from "@/graphql/typeUtils";
import { ReviewDashboardDocument } from "@/graphql/typeUtils";

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
  const { data, loading, error, refetch } = useQuery<
    ReviewDashboardQuery,
    ReviewDashboardQueryVariables
  >(ReviewDashboardDocument, {
    variables: {
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
  }, [pageNumber, resultsPerPage, sortBy, sortAscending, view]);

  return state;
};

export default useReviewDashboard;
