import { useMutation } from "@apollo/client/react";
import {
  ReportReviewConflictDocument,
  type ReportReviewConflictMutation,
  type ReportReviewConflictMutationVariables,
} from "@/graphql/typeUtils";

export default function useReportReviewConflict() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    ReportReviewConflictMutation,
    ReportReviewConflictMutationVariables
  >(ReportReviewConflictDocument, { context: { refreshAuth: true } });

  return { mutate, data: data?.reportReviewConflict, loading, error, reset };
}
