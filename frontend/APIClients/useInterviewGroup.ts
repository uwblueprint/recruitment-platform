import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewGroupDocument,
  type InterviewGroupQuery,
  type InterviewGroupQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewGroup(id?: string) {
  const { data, loading, error, refetch } = useQuery<
    InterviewGroupQuery,
    InterviewGroupQueryVariables
  >(
    InterviewGroupDocument,
    id
      ? {
          variables: { id },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  if (!id) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }
  const result = data?.interviewGroup;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No interviewGroup data returned")
      : undefined);
  return {
    data: !loading && !queryError ? result : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
