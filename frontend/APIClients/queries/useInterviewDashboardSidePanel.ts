import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewDashboardSidePanelDocument,
  type InterviewDashboardSidePanelQuery,
  type InterviewDashboardSidePanelQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewDashboardSidePanel(
  applicantRecordId?: string
) {
  const { data, loading, error, refetch } = useQuery<
    InterviewDashboardSidePanelQuery,
    InterviewDashboardSidePanelQueryVariables
  >(
    InterviewDashboardSidePanelDocument,
    !applicantRecordId
      ? skipToken
      : {
          variables: { applicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
          notifyOnNetworkStatusChange: false,
        }
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!applicantRecordId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const details = data?.interviewDashboardSidePanel;
  const queryError =
    error ??
    (!loading && !details
      ? new Error("No interview details returned")
      : undefined);

  return {
    data: !loading && !queryError ? details : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
