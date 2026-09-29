import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewedApplicantsByUserIdDocument,
  type InterviewedApplicantsByUserIdQuery,
  type InterviewedApplicantsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewedApplicantsByUserId(userId?: string) {
  const { data, loading, error, refetch } = useQuery<
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
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const rows = data?.interviewedApplicantsByUserId;
  const queryError =
    error ??
    (!loading && !rows
      ? new Error("No interviewedApplicants data returned")
      : undefined);
  return {
    data: !loading && !queryError ? rows : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
