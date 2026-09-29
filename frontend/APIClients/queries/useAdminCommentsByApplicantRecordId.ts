import type { QueryOptions } from "../types";
import { skipToken, useQuery } from "@apollo/client/react";
import {
  AdminCommentsByApplicantRecordIdDocument,
  type AdminCommentsByApplicantRecordIdQuery,
  type AdminCommentsByApplicantRecordIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useAdminCommentsByApplicantRecordId(
  applicantRecordId?: string | null,
  options: QueryOptions = {}
) {
  const { data, loading, error, refetch } = useQuery<
    AdminCommentsByApplicantRecordIdQuery,
    AdminCommentsByApplicantRecordIdQueryVariables
  >(
    AdminCommentsByApplicantRecordIdDocument,
    applicantRecordId
      ? {
          variables: { applicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
          ...options,
        }
      : skipToken
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!applicantRecordId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const result = data?.adminCommentsByApplicantRecordId;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No adminCommentsByApplicantRecordId data returned")
      : undefined);
  return {
    data: !loading && !queryError ? result : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
