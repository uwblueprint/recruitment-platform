import { useQuery } from "@apollo/client/react";
import {
  ReviewDashboardApplicantRecordIdsDocument,
  type ReviewDashboardApplicantRecordIdsQuery,
  type ReviewDashboardApplicantRecordIdsQueryVariables,
  type ReviewDashboardFilters,
  type ReviewDashboardSortBy,
} from "@/graphql/typeUtils";

/**
 * Fetches every applicant record id in the review dashboard, in the same
 * order as the paginated dashboard query, so the side panel can navigate
 * across all applicants instead of only the current page.
 *
 * Takes the same sort and filters as the table so the navigable set stays in
 * step with what is on screen; a filtered table navigates only its own rows.
 *
 * Returns an empty array while loading or on failure; callers treat that as
 * "navigation unavailable".
 */
const useReviewDashboardApplicantRecordIds = (
  sortBy?: ReviewDashboardSortBy,
  sortAscending?: boolean,
  filters?: ReviewDashboardFilters,
): string[] => {
  const { data, loading, error } = useQuery<
    ReviewDashboardApplicantRecordIdsQuery,
    ReviewDashboardApplicantRecordIdsQueryVariables
  >(ReviewDashboardApplicantRecordIdsDocument, {
    variables: { sortBy, sortAscending, filters },
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });

  return !loading && !error
    ? data?.reviewDashboardApplicantRecordIds ?? []
    : [];
};

export default useReviewDashboardApplicantRecordIds;
