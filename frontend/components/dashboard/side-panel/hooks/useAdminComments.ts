import { useCallback } from "react";
import useAdminCommentsByApplicantRecordId from "@/APIClients/queries/useAdminCommentsByApplicantRecordId";
import useCreateAdminComment from "@/APIClients/mutations/useCreateAdminComment";
import useUpdateAdminComment from "@/APIClients/mutations/useUpdateAdminComment";
import useDeleteAdminComment from "@/APIClients/mutations/useDeleteAdminComment";
import {
  AdminCommentsByApplicantRecordIdDocument,
  type AdminCommentResult,
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
  const { data: rows, loading: isLoading, error } =
    useAdminCommentsByApplicantRecordId(applicantRecordId ?? undefined, {
      // Keep comment forms mounted while a mutation refreshes the list.
      notifyOnNetworkStatusChange: false,
    });
  const { mutate: create } = useCreateAdminComment();
  const { mutate: update } = useUpdateAdminComment();
  const { mutate: remove } = useDeleteAdminComment();

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

  const hasError = !!error;

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
