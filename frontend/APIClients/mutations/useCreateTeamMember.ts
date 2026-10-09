import {
  CreateTeamMemberDocument,
  CreateTeamMemberMutation,
  CreateTeamMemberMutationVariables,
} from "@/graphql/typeUtils";
import { useMutation } from "@apollo/client/react";

export default function useCreateTeamMembers() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    CreateTeamMemberMutation,
    CreateTeamMemberMutationVariables
  >(CreateTeamMemberDocument, {
    context: { refreshAuth: true },
    onError: () => {},
  });
  return {
    reset,
    mutate,
    data: data?.createTeamMember,
    loading,
    error:
      error ??
      (called && !loading && !data?.createTeamMember
        ? new Error("No created team member returned")
        : undefined),
  };
}
