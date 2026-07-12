import { useCallback, useEffect, useState } from "react";
import AdminCommentAPIClient from "@/APIClients/AdminCommentAPIClient";
import type { AdminCommentResult } from "@/graphql/typeUtils";

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

const useAdminComments = (
  applicantRecordId: string | null,
): UseAdminCommentsResult => {
  const [comments, setComments] = useState<AdminCommentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!applicantRecordId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComments([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(false);

    AdminCommentAPIClient.getByApplicantRecordId(applicantRecordId)
      .then((rows) => {
        if (cancelled) return;
        setComments([...rows].sort(sortByCreatedAtDesc));
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setComments([]);
        setIsLoading(false);
        setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [applicantRecordId]);

  const createComment = useCallback(
    async (userId: string, comment: string) => {
      if (!applicantRecordId) return;
      const created = await AdminCommentAPIClient.create(
        userId,
        applicantRecordId,
        comment,
      );
      setComments((prev) => [created, ...prev].sort(sortByCreatedAtDesc));
    },
    [applicantRecordId],
  );

  const updateComment = useCallback(async (id: string, comment: string) => {
    const updated = await AdminCommentAPIClient.update(id, comment);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? updated : c)).sort(sortByCreatedAtDesc),
    );
  }, []);

  const deleteComment = useCallback(async (id: string) => {
    await AdminCommentAPIClient.delete(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { comments, isLoading, error, createComment, updateComment, deleteComment };
};

export default useAdminComments;
