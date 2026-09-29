import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  BulkUpdateApplicantRecordsStatusDocument,
  type BulkUpdateApplicantRecordsStatusMutation,
  type BulkUpdateApplicantRecordsStatusMutationVariables,
  type ApplicationStatus,
} from "@/graphql/typeUtils";

export default function useBulkUpdateApplicantRecordsStatus() {
  const [mutate, { data, loading, error }] = useMutation<
    BulkUpdateApplicantRecordsStatusMutation,
    BulkUpdateApplicantRecordsStatusMutationVariables
  >(BulkUpdateApplicantRecordsStatusDocument, {
    context: { refreshAuth: true },
  });
  const bulkUpdateApplicantRecordsStatus = useCallback(
    async (ids: string[], status: ApplicationStatus) => {
      const uniqueIds = [...new Set(ids)];
      const { data } = await mutate({ variables: { ids: uniqueIds, status } });
      const records = data?.bulkUpdateApplicantRecordsStatus;
      const byId = new Map(
        records?.map((record) => [record.id, record.status])
      );
      if (
        records?.length !== uniqueIds.length ||
        !uniqueIds.every((id) => byId.get(id) === status)
      ) {
        throw new Error("Not all applicant statuses were updated");
      }
    },
    [mutate]
  );
  return {
    bulkUpdateApplicantRecordsStatus,
    data: data?.bulkUpdateApplicantRecordsStatus,
    loading,
    error,
  };
}
