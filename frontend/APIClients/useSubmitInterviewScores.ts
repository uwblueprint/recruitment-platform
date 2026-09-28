import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  SubmitInterviewScoresDocument,
  type SubmitInterviewScoresMutation,
  type SubmitInterviewScoresMutationVariables,
  type InterviewInput,
} from "@/graphql/typeUtils";

export default function useSubmitInterviewScores() {
  const [mutate, { data, called, loading, error }] = useMutation<
    SubmitInterviewScoresMutation,
    SubmitInterviewScoresMutationVariables
  >(SubmitInterviewScoresDocument, { context: { refreshAuth: true } });

  const submitInterviewScores = useCallback(
    async (id: string, interviewJson: InterviewInput): Promise<void> => {
      // Keep rejections so callers advance only after a successful save.
      const { data } = await mutate({ variables: { id, interviewJson } });
      if (!data?.submitInterviewScores) {
        throw new Error("No submitted interview scores returned");
      }
    },
    [mutate]
  );

  return {
    submitInterviewScores,
    isSubmitting: loading,
    hasError: !!error || (called && !loading && !data?.submitInterviewScores),
  };
}
