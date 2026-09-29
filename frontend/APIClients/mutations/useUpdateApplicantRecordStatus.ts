import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  UpdateApplicantRecordStatusDocument,
  type UpdateApplicantRecordStatusMutation,
  type UpdateApplicantRecordStatusMutationVariables,
  type ApplicationStatus,
} from "@/graphql/typeUtils";

export default function useUpdateApplicantRecordStatus() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    UpdateApplicantRecordStatusMutation,
    UpdateApplicantRecordStatusMutationVariables
  >(UpdateApplicantRecordStatusDocument, { context: { refreshAuth: true } });
  const updateApplicantRecordStatus = useCallback(
    async (id: string, status: ApplicationStatus) => {
      const { data } = await mutate({ variables: { id, status } });
      const confirmedStatus = data?.updateApplicantRecordStatus?.status;
      if (!confirmedStatus) throw new Error("No updated status returned");
      return confirmedStatus;
    },
    [mutate]
  );
  return {
    reset,
    updateApplicantRecordStatus,
    data: data?.updateApplicantRecordStatus,
    loading,
    error,
  };
}
