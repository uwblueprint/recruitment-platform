import { useMutation } from "@apollo/client/react";
import {
  ReassignReviewerDocument,
  type ReassignReviewerMutation,
  type ReassignReviewerMutationVariables,
} from "@/graphql/typeUtils";

export default function useReassignReviewer() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    ReassignReviewerMutation,
    ReassignReviewerMutationVariables
  >(ReassignReviewerDocument, {
    context: { refreshAuth: true },
    onError: () => {},
  });
  return {
    reset,
    mutate,
    data: data?.reassignReviewer,
    loading,
    error:
      error ??
      (called && !loading && !data?.reassignReviewer
        ? new Error("No reassigned reviewer returned")
        : undefined),
  };
}
