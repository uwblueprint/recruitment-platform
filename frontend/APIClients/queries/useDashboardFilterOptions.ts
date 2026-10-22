import { useQuery } from "@apollo/client/react";
import {
  DashboardFilterOptionsDocument,
  type DashboardFilterOptionsQuery,
  type DashboardFilterOptionsQueryVariables,
} from "@/graphql/typeUtils";

export default function useDashboardFilterOptions(
  variables: DashboardFilterOptionsQueryVariables
) {
  const { data, previousData, loading, error, refetch, updateQuery } = useQuery<
    DashboardFilterOptionsQuery,
    DashboardFilterOptionsQueryVariables
  >(DashboardFilterOptionsDocument, {
    variables,
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const result = data?.dashboardFilterOptions;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No dashboardFilterOptions data returned")
      : undefined);
  return {
    data: queryError ? undefined : result,
    previousData: previousData?.dashboardFilterOptions,
    loading,
    error: queryError,
    refetch,
    updateQuery,
  };
}
