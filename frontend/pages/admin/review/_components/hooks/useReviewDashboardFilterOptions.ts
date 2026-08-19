import { useQuery } from "@apollo/client/react";
import type {
  ReviewDashboardFilterOptionsQuery,
  ReviewDashboardFilterOptionsQueryVariables,
  ReviewDashboardFilterOptionsResult,
} from "@/graphql/typeUtils";
import { ReviewDashboardFilterOptionsDocument } from "@/graphql/typeUtils";

type UseReviewDashboardFilterOptionsResult = {
  filterOptions: ReviewDashboardFilterOptionsResult | null;
  isLoading: boolean;
  error: boolean;
};

const useReviewDashboardFilterOptions = (
  department?: string,
): UseReviewDashboardFilterOptionsResult => {
  const { data, loading, error } = useQuery<
    ReviewDashboardFilterOptionsQuery,
    ReviewDashboardFilterOptionsQueryVariables
  >(ReviewDashboardFilterOptionsDocument, {
    variables: { department },
    fetchPolicy: "network-only",
  });

  return {
    filterOptions: data?.reviewDashboardFilterOptions ?? null,
    isLoading: loading,
    error: !!error,
  };
};

export default useReviewDashboardFilterOptions;
