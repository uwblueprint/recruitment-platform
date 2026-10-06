import { useMutation } from "@apollo/client/react";
import {
  CreateTeamMemberDocument,
  TeamMembersDocument,
  type CreateTeamMemberMutation,
  type CreateTeamMemberMutationVariables,
} from "@/graphql/typeUtils";

export default function useCreateTeamMember() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    CreateTeamMemberMutation,
    CreateTeamMemberMutationVariables
  >(CreateTeamMemberDocument, {
    context: { refreshAuth: true },
    refetchQueries: [TeamMembersDocument],
    awaitRefetchQueries: true,
    // Expose mutation failures through the hook's error state.
    onError: () => {},
  });

  return {
    mutate,
    data: data?.createTeamMember,
    loading,
    error:
      error ??
      (called && !loading && !data?.createTeamMember
        ? new Error("No team member mutation result returned")
        : undefined),
    reset,
  };
}