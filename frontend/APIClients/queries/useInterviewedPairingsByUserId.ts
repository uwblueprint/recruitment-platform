import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewedPairingsByUserIdDocument,
  type InterviewedPairingsByUserIdQuery,
  type InterviewedPairingsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewedPairingsByUserId(userId?: string) {
  const { data, loading, error, refetch } = useQuery<
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
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const rows = data?.interviewedPairingsByUserId;
  const queryError =
    error ??
    (!loading && !rows
      ? new Error("No interviewedPairings data returned")
      : undefined);
  return {
    data: !loading && !queryError ? rows : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
