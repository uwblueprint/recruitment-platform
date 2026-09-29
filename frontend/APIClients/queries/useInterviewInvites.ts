import { useQuery } from "@apollo/client/react";
import {
  InterviewInvitesDocument,
  type InterviewInvitesQuery,
  type InterviewInvitesQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewInvites() {
  const { data, loading, error, refetch } = useQuery<
    InterviewInvitesQuery,
    InterviewInvitesQueryVariables
  >(InterviewInvitesDocument, {
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
    data: !loading && !queryError ? invites : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
