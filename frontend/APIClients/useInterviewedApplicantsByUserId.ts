import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewedApplicantsByUserIdDocument,
  type InterviewedApplicantsByUserIdQuery,
  type InterviewedApplicantsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewedApplicantsByUserId(userId?: string) {
  const { data, loading, error } = useQuery<
    InterviewedApplicantsByUserIdQuery,
    InterviewedApplicantsByUserIdQueryVariables
  >(
    InterviewedApplicantsByUserIdDocument,
    userId
      ? {
          variables: { userId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  // skipToken retains previous data; never expose it without a current user.
  if (!userId) {
    return { interviewedApplicants: [], isLoading: false, hasError: false };
  }

  const rows = data?.interviewedApplicantsByUserId;
  const hasError = !!error || (!loading && !rows);
  return {
    interviewedApplicants: !loading && !hasError ? rows ?? [] : [],
    isLoading: loading,
    hasError,
  };
}
