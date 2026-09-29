import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewNotesDocument,
  type InterviewNotesQuery,
  type InterviewNotesQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewNotes(
  interviewedApplicantRecordId?: string | null,
  options: { notifyOnNetworkStatusChange?: boolean } = {}
) {
  const { data, loading, error, refetch } = useQuery<
    InterviewNotesQuery,
    InterviewNotesQueryVariables
  >(
    InterviewNotesDocument,
    interviewedApplicantRecordId
      ? {
          variables: { interviewedApplicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
          ...options,
        }
      : skipToken
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!interviewedApplicantRecordId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }
  return {
    // No uploaded notes is a valid empty state.
    data: !loading && !error ? data?.interviewNotes ?? null : undefined,
    loading,
    error,
    refetch,
  };
}
