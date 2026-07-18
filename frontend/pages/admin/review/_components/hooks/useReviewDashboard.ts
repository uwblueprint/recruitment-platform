import { useQuery } from "@apollo/client/react";
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
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  return {
    rows: data?.reviewDashboard ?? [],
    isLoading: loading,
    error: !!error,
    refetch: () => {
      void refetch();
    },
  };
};

export default useReviewDashboard;
