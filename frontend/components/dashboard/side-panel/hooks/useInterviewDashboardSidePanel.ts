import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewDashboardSidePanelDocument,
  type InterviewDashboardSidePanelQuery,
  type InterviewDashboardSidePanelQueryVariables,
  type InterviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";

type UseInterviewDashboardSidePanelResult = {
  data: InterviewDashboardSidePanelResult | null;
  isLoading: boolean;
  hasError: boolean;
};

const useInterviewDashboardSidePanel = (
  applicantRecordId: string | null,
): UseInterviewDashboardSidePanelResult => {
  const { data, loading, error } = useQuery<
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
        },
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!applicantRecordId) {
    return { data: null, isLoading: false, hasError: false };
  }

  const details = data?.interviewDashboardSidePanel;
  const hasError = !!error || (!loading && !details);

  return {
    data: !loading && !hasError ? details ?? null : null,
    isLoading: loading,
    hasError,
  };
};

export default useInterviewDashboardSidePanel;
