import { skipToken, useQuery } from "@apollo/client/react";
import {
  ReviewedApplicantRecordsByApplicantRecordIdDocument,
  type ReviewedApplicantRecordsByApplicantRecordIdQuery,
  type ReviewedApplicantRecordsByApplicantRecordIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewedApplicantRecordsByApplicantRecordId(
  applicantRecordId?: string,
  options: { notifyOnNetworkStatusChange?: boolean } = {}
) {
  const { data, loading, error, refetch } = useQuery<
    ReviewedApplicantRecordsByApplicantRecordIdQuery,
    ReviewedApplicantRecordsByApplicantRecordIdQueryVariables
  >(
    ReviewedApplicantRecordsByApplicantRecordIdDocument,
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

  const result = data?.reviewedApplicantRecordsByApplicantRecordId;
  const queryError =
    error ??
    (!loading && !result
      ? new Error(
          "No reviewedApplicantRecordsByApplicantRecordId data returned"
        )
      : undefined);
  return {
    data: !loading && !queryError ? result : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
