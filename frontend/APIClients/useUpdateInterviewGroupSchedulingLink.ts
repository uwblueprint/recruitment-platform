import { useMutation } from "@apollo/client/react";
import {
  UpdateInterviewGroupSchedulingLinkDocument,
  type UpdateInterviewGroupSchedulingLinkMutation,
  type UpdateInterviewGroupSchedulingLinkMutationVariables,
} from "@/graphql/typeUtils";

export default function useUpdateInterviewGroupSchedulingLink() {
  const [mutate, { data, called, loading, error }] = useMutation<
    UpdateInterviewGroupSchedulingLinkMutation,
    UpdateInterviewGroupSchedulingLinkMutationVariables
  >(UpdateInterviewGroupSchedulingLinkDocument, {
    context: { refreshAuth: true },
    // Expose mutation failures to the UI without an unhandled rejection.
    onError: () => {},
  });
  return {
    mutate,
    data: data?.updateInterviewGroupSchedulingLink,
    loading,
    error:
      error ??
      (called && !loading && !data?.updateInterviewGroupSchedulingLink
        ? new Error("No updated interview group returned")
        : undefined),
  };
}
