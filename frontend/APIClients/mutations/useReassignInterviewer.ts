import { useMutation } from "@apollo/client/react";
import {
  ReassignInterviewerDocument,
  type ReassignInterviewerMutation,
  type ReassignInterviewerMutationVariables,
} from "@/graphql/typeUtils";

export default function useReassignInterviewer() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    ReassignInterviewerMutation,
    ReassignInterviewerMutationVariables
  >(ReassignInterviewerDocument, {
    context: { refreshAuth: true },
    onError: () => {},
  });
  return {
    reset,
    mutate,
    data: data?.reassignInterviewer,
    loading,
    error:
      error ??
      (called && !loading && !data?.reassignInterviewer
        ? new Error("No reassigned interviewer returned")
        : undefined),
  };
}
