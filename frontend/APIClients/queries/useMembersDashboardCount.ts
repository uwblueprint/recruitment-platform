import type { MembersDashboardFilters } from "@/types/membersDashboard";
import {
  filterMockMembers,
  refetchMockMembers,
} from "./mocks/membersDashboard";

// Like review, counts use the same filters as the rows, without pagination.
// Replace with useQuery following useReviewDashboardCount once available.
export default function useMembersDashboardCount(
  filters?: MembersDashboardFilters
) {
  return {
    count: filterMockMembers(filters).length,
    loading: false,
    error: undefined as Error | undefined,
    refetch: refetchMockMembers,
  };
}
