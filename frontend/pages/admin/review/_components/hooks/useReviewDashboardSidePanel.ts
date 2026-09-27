import { useEffect, useState } from "react";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type { ReviewDashboardSidePanelResult } from "@/graphql/typeUtils";

type UseReviewDashboardSidePanelResult = {
  details?: ReviewDashboardSidePanelResult;
  isLoading: boolean;
  error: boolean;
};

/**
 * Fetches the expanded side-panel details for a single applicant record.
 *
 * Pass `undefined` when no row is active to skip fetching and clear any
 * previous result.
 */
const useReviewDashboardSidePanel = (
  applicantRecordId: string | undefined,
): UseReviewDashboardSidePanelResult => {
  const [state, setState] = useState<UseReviewDashboardSidePanelResult>({
    details: undefined,
    isLoading: false,
    error: false,
  });

  useEffect(() => {
    if (!applicantRecordId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ details: undefined, isLoading: false, error: false });
      return;
    }

    let isCurrent = true;
    setState((prev) => ({ ...prev, isLoading: true, error: false }));

    ReviewDashboardAPIClient.getReviewDashboardSidePanel(applicantRecordId)
      .then((details) => {
        if (isCurrent) {
          setState({ details, isLoading: false, error: false });
        }
      })
      .catch(() => {
        if (isCurrent) {
          setState({ details: undefined, isLoading: false, error: true });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [applicantRecordId]);

  return state;
};

export default useReviewDashboardSidePanel;
