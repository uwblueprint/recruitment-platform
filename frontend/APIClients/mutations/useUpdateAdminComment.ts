import { useMutation } from "@apollo/client/react";
import {
  UpdateAdminCommentDocument,
  type UpdateAdminCommentMutation,
  type UpdateAdminCommentMutationVariables,
} from "@/graphql/typeUtils";

export default function useUpdateAdminComment() {
  const [mutate, { data, loading, error }] = useMutation<
    UpdateAdminCommentMutation,
    UpdateAdminCommentMutationVariables
  >(UpdateAdminCommentDocument, { context: { refreshAuth: true } });

  return { mutate, data: data?.updateAdminComment, loading, error };
}
