import { useQuery } from "@apollo/client/react";
import {
  InterviewUnmatchedApplicantsDocument,
  type InterviewUnmatchedApplicantsQuery,
  type InterviewUnmatchedApplicantsQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewUnmatchedApplicants() {
  const { data, loading, error, refetch } = useQuery<
    InterviewUnmatchedApplicantsQuery,
    InterviewUnmatchedApplicantsQueryVariables
  >(InterviewUnmatchedApplicantsDocument, {
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const groups = data?.interviewUnmatchedApplicants;
  const queryError =
    error ??
    (!loading && !groups
      ? new Error("No unmatched applicants returned")
      : undefined);

  return {
    data: queryError ? undefined : groups,
    loading,
    error: queryError,
    refetch,
  };
}
