import type { InterviewReviewDetailsQuery, InterviewReviewDetailsQueryVariables } from "@/graphql/__generated__/operation-types";
import type { QueryOptions } from "../types";
import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewReviewDetailsDocument,
} from "@/graphql/typeUtils";

export default function useInterviewReviewDetails(
  applicantRecordId?: string,
  options: QueryOptions = {}
) {
  const { data, loading, error, refetch } = useQuery<
    InterviewReviewDetailsQuery,
    InterviewReviewDetailsQueryVariables
  >(
    InterviewReviewDetailsDocument,
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

  const result = data?.interviewReviewDetails;
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
