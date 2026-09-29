import { skipToken, useQuery } from "@apollo/client/react";
import {
  ReviewDashboardSidePanelDocument,
  type ReviewDashboardSidePanelQuery,
  type ReviewDashboardSidePanelQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewDashboardSidePanel(
  applicantRecordId?: string
) {
  const { data, loading, error, refetch } = useQuery<
    ReviewDashboardSidePanelQuery,
    ReviewDashboardSidePanelQueryVariables
  >(
    ReviewDashboardSidePanelDocument,
    applicantRecordId
      ? {
          variables: { applicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!applicantRecordId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const details = data?.reviewDashboardSidePanel;
  const queryError =
    error ??
    (!loading && !details
      ? new Error("No review dashboard side-panel data returned")
      : undefined);

  return {
    data: !loading && !queryError ? details : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
