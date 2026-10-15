import { useQuery } from "@apollo/client/react";
import {
  DashboardView,
  InterviewDashboardCountsDocument,
  type InterviewDashboardFilters,
} from "@/graphql/typeUtils";

export default function useInterviewDashboardCounts(
  filters?: InterviewDashboardFilters
) {
  const { data, loading, error } = useQuery(InterviewDashboardCountsDocument, {
    variables: { filters },
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const counts = data?.interviewDashboardCounts;
  return {
    counts: {
      [DashboardView.All]: counts?.all,
      [DashboardView.Shortlisted]: counts?.shortlisted,
      [DashboardView.Conflicts]: counts?.conflicts,
    },
    loading,
    error,
  };
}
