import { useQuery } from "@apollo/client/react";
import {
  InterviewDashboardDocument,
  type InterviewDashboardQuery,
  type InterviewDashboardQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewDashboard(
  variables: InterviewDashboardQueryVariables
) {
  const { data, previousData, loading, error, refetch } = useQuery<
    InterviewDashboardQuery,
    InterviewDashboardQueryVariables
  >(InterviewDashboardDocument, {
    variables,
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const rows = data?.interviewDashboard;
  const queryError =
    error ??
    (!loading && !rows
      ? new Error("No interview dashboard data returned")
      : undefined);
  return {
    data: queryError ? undefined : rows,
    previousData: previousData?.interviewDashboard,
    loading,
    error: queryError,
    refetch,
  };
}
