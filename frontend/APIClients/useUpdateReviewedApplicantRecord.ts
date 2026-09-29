import { useMutation } from "@apollo/client/react";
import {
  UpdateReviewedApplicantRecordDocument,
  ReviewedApplicantRecordsByApplicantRecordIdDocument,
  type UpdateReviewedApplicantRecordMutation,
  type UpdateReviewedApplicantRecordMutationVariables,
} from "@/graphql/typeUtils";

export default function useUpdateReviewedApplicantRecord() {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    UpdateReviewedApplicantRecordMutation,
    UpdateReviewedApplicantRecordMutationVariables
  >(UpdateReviewedApplicantRecordDocument, {
    context: { refreshAuth: true },
    awaitRefetchQueries: true,
    // Apollo exposes failures through `error`; event handlers need no catch.
    onError: () => {},
  });

  const updateReviewedApplicantRecord = (
    applicantRecordId: string,
    reviewerId: string,
    reviewedApplicantRecord: UpdateReviewedApplicantRecordMutationVariables["reviewedApplicantRecord"],
    onCompleted: () => void
  ): void => {
    void mutate({
      onCompleted: (result) => {
        if (result.updateReviewedApplicantRecord) onCompleted();
      },
      variables: {
        applicantRecordId,
        reviewerId,
        reviewedApplicantRecord,
      },
      refetchQueries: [
        {
          query: ReviewedApplicantRecordsByApplicantRecordIdDocument,
          variables: { applicantRecordId },
          context: { refreshAuth: true },
        },
      ],
    });
  };

  return {
    updateReviewedApplicantRecord,
    data: data?.updateReviewedApplicantRecord,
    loading,
    error:
      error ??
      (called && !loading && !data?.updateReviewedApplicantRecord
        ? new Error("No updated review returned")
        : undefined),
    reset,
  };
}
