import { useMutation } from "@apollo/client/react";
import {
  SubmitInterviewScoresDocument,
  type SubmitInterviewScoresMutation,
  type SubmitInterviewScoresMutationVariables,
} from "@/graphql/typeUtils";

export default function useSubmitInterviewScores() {
  const [mutate, { data, called, loading, error }] = useMutation<
    SubmitInterviewScoresMutation,
    SubmitInterviewScoresMutationVariables
  >(SubmitInterviewScoresDocument, { context: { refreshAuth: true } });

  return {
    mutate,
    data: data?.submitInterviewScores,
    loading,
    error:
      error ??
      (called && !loading && !data?.submitInterviewScores
        ? new Error("No submitted interview scores returned")
        : undefined),
  };
}
