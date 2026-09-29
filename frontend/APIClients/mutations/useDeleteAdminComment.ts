import { refreshAdminComments } from "../adminCommentsCache";
import { useMutation } from "@apollo/client/react";
import {
  DeleteAdminCommentByIdDocument,
  type DeleteAdminCommentByIdMutation,
  type DeleteAdminCommentByIdMutationVariables,
} from "@/graphql/typeUtils";

export default function useDeleteAdminComment(
  applicantRecordId?: string | null
) {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    DeleteAdminCommentByIdMutation,
    DeleteAdminCommentByIdMutationVariables
  >(DeleteAdminCommentByIdDocument, {
    context: { refreshAuth: true },
    ...refreshAdminComments(applicantRecordId),
  });

  return {
    mutate,
    data: data?.deleteAdminCommentById,
    loading,
    error:
      error ??
      (called && !loading && !data?.deleteAdminCommentById
        ? new Error("No admin comment mutation result returned")
        : undefined),
    reset,
  };
}
