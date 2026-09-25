import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";

/**
 * Fetches every applicant record id in the review dashboard, in the same
 * order as the paginated dashboard query, so the side panel can navigate
 * across all applicants instead of only the current page.
 *
 * Returns an empty array while loading or on failure; callers treat that as
 * "navigation unavailable".
 */
const useReviewDashboardApplicantRecordIds = (): string[] => {
  const [applicantRecordIds, setApplicantRecordIds] = useState<string[]>([]);

  useEffect(() => {
    let isCurrent = true;

    ReviewDashboardAPIClient.getReviewDashboardApplicantRecordIds()
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
  }, []);

  return applicantRecordIds;
};

export default useReviewDashboardApplicantRecordIds;
