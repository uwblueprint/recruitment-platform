import type {
  Member,
  MembersDashboardVariables,
} from "@/types/membersDashboard";
import {
  filterMockMembers,
  refetchMockMembers,
} from "./mocks/membersDashboard";

/**
 * Temporary mock implementation. Add the operation under graphql/operations,
 * run npm run generate, and export its document/types from graphql/typeUtils.
 * Replace this body with useQuery from @apollo/client/react, following
 * useReviewDashboard: fetchPolicy: "network-only", context: { refreshAuth: true }.
 * Return the result array as data/previousData and forward loading/error/refetch.
 * Replace the temporary MembersDashboardVariables/Member types with generated aliases.
 */
export default function useMembersDashboard(
  variables: MembersDashboardVariables
): {
  data: Member[] | undefined;
  previousData: Member[] | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<unknown>;
} {
  const rows = filterMockMembers(variables.filters);
  const startIndex = (variables.pageNumber - 1) * variables.resultsPerPage;
  return {
    data: rows.slice(startIndex, startIndex + variables.resultsPerPage),
    previousData: undefined,
    loading: false,
    error: undefined,
    refetch: refetchMockMembers,
  };
}
