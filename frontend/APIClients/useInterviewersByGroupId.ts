import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewersByGroupIdDocument,
  type InterviewersByGroupIdQuery,
  type InterviewersByGroupIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewersByGroupId(groupId?: string) {
  const { data, loading, error, refetch } = useQuery<
    InterviewersByGroupIdQuery,
    InterviewersByGroupIdQueryVariables
  >(
    InterviewersByGroupIdDocument,
    groupId
      ? {
          variables: { groupId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  if (!groupId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }
  const result = data?.interviewersByGroupId;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No interviewersByGroupId data returned")
      : undefined);
  return {
    data: !loading && !queryError ? result : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
