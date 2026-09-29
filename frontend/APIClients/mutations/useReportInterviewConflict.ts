import { useMutation } from "@apollo/client/react";
import {
  ReportInterviewConflictDocument,
  type ReportInterviewConflictMutation,
  type ReportInterviewConflictMutationVariables,
} from "@/graphql/typeUtils";

export default function useReportInterviewConflict() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    ReportInterviewConflictMutation,
    ReportInterviewConflictMutationVariables
  >(ReportInterviewConflictDocument, {
    context: { refreshAuth: true },
    // The dialog renders mutation failures directly.
    onError: () => {},
  });
  return {
    mutate,
    data: data?.reportInterviewConflict,
    loading,
    error:
      error ??
      (called && !loading && !data?.reportInterviewConflict
        ? new Error("No reported interview conflict returned")
        : undefined),
    reset,
  };
}
