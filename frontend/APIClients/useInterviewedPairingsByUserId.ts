import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewedPairingsByUserIdDocument,
  type InterviewedPairingsByUserIdQuery,
  type InterviewedPairingsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewedPairingsByUserId(userId?: string) {
  const { data, loading, error } = useQuery<
    InterviewedPairingsByUserIdQuery,
    InterviewedPairingsByUserIdQueryVariables
  >(
    InterviewedPairingsByUserIdDocument,
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
    return { interviewedPairings: [], isLoading: false, hasError: false };
  }

  const rows = data?.interviewedPairingsByUserId;
  const hasError = !!error || (!loading && !rows);
  return {
    interviewedPairings: !loading && !hasError ? rows ?? [] : [],
    isLoading: loading,
    hasError,
  };
}
