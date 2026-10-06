import { useQuery } from "@apollo/client/react";
import {
  TeamMembersDocument,
  type TeamMembersQuery,
  type TeamMembersQueryVariables,
} from "@/graphql/typeUtils";

export default function useTeamMembers() {
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