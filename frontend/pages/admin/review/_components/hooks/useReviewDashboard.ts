import { useCallback, useQuery } from "@apollo/client/react";
import type {
  DashboardView,
  ReviewDashboardFilters,
  ReviewDashboardQuery,
  ReviewDashboardQueryVariables,
  ReviewDashboardResult,
  ReviewDashboardSortBy,
} from "@/graphql/typeUtils";
import { ReviewDashboardDocument } from "@/graphql/typeUtils";

type UseReviewDashboardResult = {
  rows: ReviewDashboardResult[];
  isLoading: boolean;
  error: boolean;
  refetch: () => void;
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
    isLoading: false,
    error: false,
  });
  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: false }));
    ReviewDashboardAPIClient.getReviewDashboard(
  const { data, loading, error, refetch } = useQuery<
    ReviewDashboardQuery,
    ReviewDashboardQueryVariables
  >(ReviewDashboardDocument, {
    variables: {
      pageNumber,
      resultsPerPage,
      sortBy,
      sortAscending,
      filters,
      view,
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
