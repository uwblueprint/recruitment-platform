import { useMutation } from "@apollo/client/react";
import {
  DeleteAdminCommentByIdDocument,
  type DeleteAdminCommentByIdMutation,
  type DeleteAdminCommentByIdMutationVariables,
} from "@/graphql/typeUtils";

export default function useDeleteAdminComment() {
  const [mutate, { data, loading, error }] = useMutation<
    DeleteAdminCommentByIdMutation,
    DeleteAdminCommentByIdMutationVariables
  >(DeleteAdminCommentByIdDocument, { context: { refreshAuth: true } });

  return { mutate, data: data?.deleteAdminCommentById, loading, error };
}
