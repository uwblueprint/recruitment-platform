import { useQuery } from "@apollo/client/react";
import { InterviewInvitesCountsDocument, type InterviewInvitesCountsQueryVariables } from "@/graphql/typeUtils";

export default function useInterviewInvitesCounts(variables: InterviewInvitesCountsQueryVariables = {}) {
  const { data, loading, error } = useQuery(InterviewInvitesCountsDocument, {
    variables,
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  return {
    counts: data?.interviewInvitesCounts,
    loading,
    error,
  };
}
