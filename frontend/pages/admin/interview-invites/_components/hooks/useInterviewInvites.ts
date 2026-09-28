import { useQuery } from "@apollo/client/react";
import {
  InterviewInvitesDocument,
  type InterviewInvitesQuery,
  type InterviewInvitesQueryVariables,
  type InterviewInviteResult,
} from "@/graphql/typeUtils";

type UseInterviewInvitesResult = {
  invites: InterviewInviteResult[];
  isLoading: boolean;
  error: boolean;
};

const useInterviewInvites = (): UseInterviewInvitesResult => {
  const { data, loading, error } = useQuery<
    InterviewInvitesQuery,
    InterviewInvitesQueryVariables
  >(InterviewInvitesDocument, {
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });

  const invites = data?.interviewInvites;
  const hasError = !!error || (!loading && !invites);

  return {
    invites: !loading && !hasError ? invites ?? [] : [],
    isLoading: loading,
    error: hasError,
  };
};

export default useInterviewInvites;
