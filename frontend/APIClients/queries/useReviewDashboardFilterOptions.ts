import { useQuery } from "@apollo/client/react";
import {
  ReviewDashboardFilterOptionsDocument,
  type ReviewDashboardFilterOptionsQuery,
  type ReviewDashboardFilterOptionsQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewDashboardFilterOptions(
  variables: ReviewDashboardFilterOptionsQueryVariables
) {
  const { data, previousData, loading, error, refetch, updateQuery } = useQuery<
    ReviewDashboardFilterOptionsQuery,
    ReviewDashboardFilterOptionsQueryVariables
  >(ReviewDashboardFilterOptionsDocument, {
    variables,
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const result = data?.reviewDashboardFilterOptions;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No reviewDashboardFilterOptions data returned")
      : undefined);
  return {
    data: queryError ? undefined : result,
    previousData: previousData?.reviewDashboardFilterOptions,
    loading,
    error: queryError,
    refetch,
    updateQuery,
  };
}
