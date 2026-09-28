import { skipToken, useQuery } from "@apollo/client/react";
import {
  ReviewDashboardSidePanelDocument,
  type ReviewDashboardSidePanelQuery,
  type ReviewDashboardSidePanelQueryVariables,
  type ReviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";

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
  const { data, loading, error } = useQuery<
    ReviewDashboardSidePanelQuery,
    ReviewDashboardSidePanelQueryVariables
  >(
    ReviewDashboardSidePanelDocument,
    !applicantRecordId
      ? skipToken
      : {
          variables: { applicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        },
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!applicantRecordId) {
    return { details: undefined, isLoading: false, error: false };
  }

  const details = data?.reviewDashboardSidePanel;
  const hasError = !!error || (!loading && !details);

  return {
    details: !loading && !hasError ? details : undefined,
    isLoading: loading,
    error: hasError,
  };
};

export default useReviewDashboardSidePanel;
