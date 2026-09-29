import { useQuery } from "@apollo/client/react";
import {
  DashboardView,
  ReviewDashboardCountsDocument,
  type ReviewDashboardFilters,
} from "@/graphql/typeUtils";

export default function useReviewDashboardCount(filters?: ReviewDashboardFilters) {
  const { data, loading, error, refetch } = useQuery(
    ReviewDashboardCountsDocument,
    {
      variables: { filters },
      fetchPolicy: "network-only",
      context: { refreshAuth: true },
    }
  );
  const counts = data?.reviewDashboardCounts;
  return {
    counts: {
      [DashboardView.All]: counts?.all,
      [DashboardView.Shortlisted]: counts?.shortlisted,
      [DashboardView.Conflicts]: counts?.conflicts,
    },
    loading,
    error,
    refetch,
  };
}
