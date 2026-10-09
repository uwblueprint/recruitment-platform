import {
  TeamMembersDocument,
  TeamMembersQuery,
  TeamMembersQueryVariables,
} from "@/graphql/typeUtils";
import { useQuery } from "@apollo/client/react";

export default function useTeamMember() {
  const { data, loading, error, refetch } = useQuery<
    TeamMembersQuery,
    TeamMembersQueryVariables
  >(TeamMembersDocument, {
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });

  const result = data?.teamMembers;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No team members data returned")
      : undefined);

  return {
    data: !loading && !queryError ? result : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
