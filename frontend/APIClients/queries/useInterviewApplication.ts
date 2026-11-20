import type { InterviewApplicationQuery, InterviewApplicationQueryVariables } from "@/graphql/__generated__/operation-types";
import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewApplicationDocument,
} from "@/graphql/typeUtils";

export default function useInterviewApplication(applicantRecordId?: string) {
  const { data, loading, error, refetch } = useQuery<
    InterviewApplicationQuery,
    InterviewApplicationQueryVariables
  >(
    InterviewApplicationDocument,
    applicantRecordId
      ? {
          variables: { applicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!applicantRecordId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const result = data?.interviewApplication;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No application data returned")
      : undefined);
  return {
    data: !loading && !queryError ? result : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
