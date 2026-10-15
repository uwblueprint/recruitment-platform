import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  ReviewDashboardCountsDocument,
  ReviewDashboardDocument,
  ReviewDashboardSidePanelDocument,
  UpdateApplicantRecordShortlistedForInterviewDocument,
  type UpdateApplicantRecordShortlistedForInterviewMutation,
  type UpdateApplicantRecordShortlistedForInterviewMutationVariables,
} from "@/graphql/typeUtils";

export default function useUpdateApplicantRecordShortlistedForInterview() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    UpdateApplicantRecordShortlistedForInterviewMutation,
    UpdateApplicantRecordShortlistedForInterviewMutationVariables
  >(UpdateApplicantRecordShortlistedForInterviewDocument, {
    context: { refreshAuth: true },
    onError: () => {},
  });
  const updateShortlistedForInterview = useCallback(
    (id: string, shortlistedValue: boolean) => {
      if (loading) return;
      void mutate({
        variables: { id, shortlistedValue },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: ReviewDashboardSidePanelDocument,
            variables: { applicantRecordId: id },
            context: { refreshAuth: true },
          },
          ReviewDashboardCountsDocument,
          ReviewDashboardDocument,
        ],
      });
    },
    [mutate, loading]
  );
  return {
    reset,
    updateShortlistedForInterview,
    data: data?.updateApplicantRecordShortlistedForInterview,
    loading,
    error:
      error ??
      (called &&
      !loading &&
      !data?.updateApplicantRecordShortlistedForInterview
        ? new Error("No updated shortlist status returned")
        : undefined),
  };
}
