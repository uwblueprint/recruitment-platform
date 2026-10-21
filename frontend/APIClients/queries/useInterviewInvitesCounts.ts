import { useQuery } from "@apollo/client/react";
import { InterviewInvitesCountsDocument } from "@/graphql/typeUtils";

export default function useInterviewInvitesCounts() {
  const { data, loading, error } = useQuery(InterviewInvitesCountsDocument, {
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  return {
    counts: data?.interviewInvitesCounts,
    loading,
    error,
  };
}
