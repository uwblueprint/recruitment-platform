import { refreshAdminComments } from "../adminCommentsCache";
import { useMutation } from "@apollo/client/react";
import {
  UpdateAdminCommentDocument,
  type UpdateAdminCommentMutation,
  type UpdateAdminCommentMutationVariables,
} from "@/graphql/typeUtils";

export default function useUpdateAdminComment(
  applicantRecordId?: string | null
) {
  const [mutate, { data, called, loading, error, reset }] = useMutation<
    UpdateAdminCommentMutation,
    UpdateAdminCommentMutationVariables
  >(UpdateAdminCommentDocument, {
    context: { refreshAuth: true },
    ...refreshAdminComments(applicantRecordId),
  });

  return {
    mutate,
    data: data?.updateAdminComment,
    loading,
    error:
      error ??
      (called && !loading && !data?.updateAdminComment
        ? new Error("No admin comment mutation result returned")
        : undefined),
    reset,
  };
}
