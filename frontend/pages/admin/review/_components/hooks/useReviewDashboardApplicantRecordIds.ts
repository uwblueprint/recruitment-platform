import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type {
  ReviewDashboardFilters,
  ReviewDashboardSortBy,
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
  const [applicantRecordIds, setApplicantRecordIds] = useState<string[]>([]);

  useEffect(() => {
    let isCurrent = true;

    ReviewDashboardAPIClient.getReviewDashboardApplicantRecordIds(
      sortBy,
      sortAscending,
      filters,
    )
      .then((ids) => {
        if (isCurrent) {
          setApplicantRecordIds(ids);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setApplicantRecordIds([]);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [sortBy, sortAscending, filters]);

  return applicantRecordIds;
};

export default useReviewDashboardApplicantRecordIds;
