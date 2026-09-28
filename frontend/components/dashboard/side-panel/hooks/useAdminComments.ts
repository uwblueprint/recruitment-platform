import { useCallback } from "react";
import { skipToken, useMutation, useQuery } from "@apollo/client/react";
import {
  AdminCommentsByApplicantRecordIdDocument,
  CreateAdminCommentDocument,
  UpdateAdminCommentDocument,
  DeleteAdminCommentByIdDocument,
  type AdminCommentResult,
  type AdminCommentsByApplicantRecordIdQuery,
  type AdminCommentsByApplicantRecordIdQueryVariables,
  type CreateAdminCommentMutation,
  type CreateAdminCommentMutationVariables,
  type UpdateAdminCommentMutation,
  type UpdateAdminCommentMutationVariables,
  type DeleteAdminCommentByIdMutation,
  type DeleteAdminCommentByIdMutationVariables,
} from "@/graphql/typeUtils";

type UseAdminCommentsResult = {
  comments: AdminCommentResult[];
  isLoading: boolean;
  error: boolean;
  createComment: (userId: string, comment: string) => Promise<void>;
  updateComment: (id: string, comment: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
};

const parseDate = (value: string) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && value.trim() !== "") {
    return numeric;
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortByCreatedAtDesc = (a: AdminCommentResult, b: AdminCommentResult) =>
  parseDate(b.createdAt) - parseDate(a.createdAt);

const refreshComments = (applicantRecordId: string) => ({
  awaitRefetchQueries: true,
  refetchQueries: [
    {
      query: AdminCommentsByApplicantRecordIdDocument,
      variables: { applicantRecordId },
      context: { refreshAuth: true },
    },
  ],
});

const useAdminComments = (
  applicantRecordId: string | null
): UseAdminCommentsResult => {
  const { data, loading, error } = useQuery<
    AdminCommentsByApplicantRecordIdQuery,
    AdminCommentsByApplicantRecordIdQueryVariables
  >(
    AdminCommentsByApplicantRecordIdDocument,
    !applicantRecordId
      ? skipToken
      : {
          variables: { applicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
          // Keep comment forms mounted while a mutation refreshes the list.
          notifyOnNetworkStatusChange: false,
        }
  );
  const [create] = useMutation<
    CreateAdminCommentMutation,
    CreateAdminCommentMutationVariables
  >(CreateAdminCommentDocument, { context: { refreshAuth: true } });
  const [update] = useMutation<
    UpdateAdminCommentMutation,
    UpdateAdminCommentMutationVariables
  >(UpdateAdminCommentDocument, { context: { refreshAuth: true } });
  const [remove] = useMutation<
    DeleteAdminCommentByIdMutation,
    DeleteAdminCommentByIdMutationVariables
  >(DeleteAdminCommentByIdDocument, { context: { refreshAuth: true } });

  const createComment = useCallback(
    async (userId: string, comment: string) => {
      if (!applicantRecordId) return;
      const { data } = await create({
        variables: { adminComment: { userId, applicantRecordId, comment } },
        ...refreshComments(applicantRecordId),
      });
      if (!data?.createAdminComment) {
        throw new Error("Failed to create admin comment");
      }
    },
    [applicantRecordId, create]
  );

  const updateComment = useCallback(
    async (id: string, comment: string) => {
      if (!applicantRecordId) return;
      const { data } = await update({
        variables: { id, adminComment: { comment } },
        ...refreshComments(applicantRecordId),
      });
      if (!data?.updateAdminComment) {
        throw new Error("Failed to update admin comment");
      }
    },
    [applicantRecordId, update]
  );

  const deleteComment = useCallback(
    async (id: string) => {
      if (!applicantRecordId) return;
      const { data } = await remove({
        variables: { id },
        ...refreshComments(applicantRecordId),
      });
      if (!data?.deleteAdminCommentById) {
        throw new Error("Failed to delete admin comment");
      }
    },
    [applicantRecordId, remove]
  );

  // skipToken retains previous data; never expose it without a current ID.
  const rows = applicantRecordId
    ? data?.adminCommentsByApplicantRecordId
    : undefined;
  const isLoading = !!applicantRecordId && loading;
  const hasError = !!applicantRecordId && (!!error || (!loading && !rows));

  return {
    comments:
      !isLoading && !hasError && rows
        ? [...rows].sort(sortByCreatedAtDesc)
        : [],
    isLoading,
    error: hasError,
    createComment,
    updateComment,
    deleteComment,
  };
};

export default useAdminComments;
