import { refreshAdminComments } from "../adminCommentsCache";
import { useMutation } from "@apollo/client/react";
import {
  CreateAdminCommentDocument,
  type CreateAdminCommentMutation,
  type CreateAdminCommentMutationVariables,
} from "@/graphql/typeUtils";

export default function useCreateAdminComment(
  applicantRecordId?: string | null
) {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    CreateAdminCommentMutation,
    CreateAdminCommentMutationVariables
  >(CreateAdminCommentDocument, {
    context: { refreshAuth: true },
    ...refreshAdminComments(applicantRecordId),
  });

  return {
    mutate,
    data: data?.createAdminComment,
    loading,
    error:
      error ??
      (called && !loading && !data?.createAdminComment
        ? new Error("No admin comment mutation result returned")
        : undefined),
    reset,
  };
}
