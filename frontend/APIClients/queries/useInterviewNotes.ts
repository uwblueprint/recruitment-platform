import type { QueryOptions } from "../types";
import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewNotesDocument,
  type InterviewNotesQuery,
  type InterviewNotesQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewNotes(
  interviewedApplicantRecordId?: string,
  options: QueryOptions = {}
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
  const queryError =
    error ??
    (!loading && !data
      ? new Error("No interview notes response returned")
      : undefined);
  return {
    // No uploaded notes is a valid empty state.
    data: !loading && !queryError ? data?.interviewNotes ?? null : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
