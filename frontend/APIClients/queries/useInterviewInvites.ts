import { useQuery } from "@apollo/client/react";
import {
  InterviewInvitesDocument,
  type InterviewInvitesQuery,
  type InterviewInvitesQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewInvites(variables: InterviewInvitesQueryVariables) {
  const { data, previousData, loading, error, refetch } = useQuery<
    InterviewInvitesQuery,
    InterviewInvitesQueryVariables
  >(InterviewInvitesDocument, {
    variables,
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const invites = data?.interviewInvites;
  const queryError =
    error ??
    (!loading && !invites
      ? new Error("No interview invites returned")
      : undefined);

  return {
    data: queryError ? undefined : invites,
    previousData: previousData?.interviewInvites,
    loading,
    error: queryError,
    refetch,
  };
}
