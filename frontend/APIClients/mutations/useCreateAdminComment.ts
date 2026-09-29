import { useMutation } from "@apollo/client/react";
import {
  CreateAdminCommentDocument,
  type CreateAdminCommentMutation,
  type CreateAdminCommentMutationVariables,
} from "@/graphql/typeUtils";

export default function useCreateAdminComment() {
  const [mutate, { data, loading, error }] = useMutation<
    CreateAdminCommentMutation,
    CreateAdminCommentMutationVariables
  >(CreateAdminCommentDocument, { context: { refreshAuth: true } });

  return { mutate, data: data?.createAdminComment, loading, error };
}
