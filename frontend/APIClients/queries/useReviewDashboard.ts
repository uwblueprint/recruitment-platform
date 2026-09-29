import { useQuery } from "@apollo/client/react";
import {
  ReviewDashboardDocument,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewDashboard(
  variables: ReviewDashboardQueryVariables
) {
  const { data, previousData, loading, error, refetch, updateQuery } = useQuery<
    ReviewDashboardQuery,
    ReviewDashboardQueryVariables
  >(ReviewDashboardDocument, {
    variables,
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const result = data?.reviewDashboard;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No reviewDashboard data returned")
      : undefined);
  return {
    data: queryError ? undefined : result,
    previousData: previousData?.reviewDashboard,
    loading,
    error: queryError,
    refetch,
    updateQuery,
  };
}
