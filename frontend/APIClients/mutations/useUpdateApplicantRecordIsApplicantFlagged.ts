import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  UpdateApplicantRecordIsApplicantFlaggedDocument,
  InterviewDashboardSidePanelDocument,
  type UpdateApplicantRecordIsApplicantFlaggedMutation,
  type UpdateApplicantRecordIsApplicantFlaggedMutationVariables,
} from "@/graphql/typeUtils";

export default function useUpdateApplicantRecordIsApplicantFlagged() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    UpdateApplicantRecordIsApplicantFlaggedMutation,
    UpdateApplicantRecordIsApplicantFlaggedMutationVariables
  >(UpdateApplicantRecordIsApplicantFlaggedDocument, {
    context: { refreshAuth: true },
    onError: () => {},
  });
  const updateFlag = useCallback(
    (id: string, flagValue: boolean) => {
      if (loading) return;
      void mutate({
        variables: { id, flagValue },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: InterviewDashboardSidePanelDocument,
            variables: { applicantRecordId: id },
            context: { refreshAuth: true },
          },
        ],
      });
    },
    [mutate, loading]
  );
  return {
    reset,
    updateFlag,
    data: data?.updateApplicantRecordIsApplicantFlagged,
    loading,
    error:
      error ??
      (called && !loading && !data?.updateApplicantRecordIsApplicantFlagged
        ? new Error("No updated bookmark returned")
        : undefined),
  };
}
