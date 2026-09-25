import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { AdminCommentComposer } from "./AdminCommentComposer";
import { AdminCommentItem } from "./AdminCommentItem";
import useAdminComments from "./useAdminComments";

type AdminCommentsProps = {
  applicantRecordId: string;
};

export const AdminCommentsSection = ({
  applicantRecordId,
}: AdminCommentsProps) => {
  const authenticatedUser = useAuthenticatedUser();
  const {
    comments,
    isLoading,
    error,
    createComment,
    updateComment,
    deleteComment,
  } = useAdminComments(applicantRecordId);

  return (
    <section className="flex flex-col gap-2.5 font-source text-sm text-neutral-800">
      <h3 className="text-sm font-semibold text-blue-900">Admin Comments</h3>

      {authenticatedUser ? (
        <AdminCommentComposer
          onSubmit={(comment) => createComment(authenticatedUser.id, comment)}
        />
      ) : null}

      {error ? (
        <div className="rounded border border-alert-errorBorder bg-red-50 px-3 py-2 text-xs text-alert-errorText">
          Failed to load admin comments
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading comments...</p>
      ) : comments.length === 0 && !error ? (
        <p className="border-b border-neutral-200 py-2 text-sm text-neutral-500">
          No admin comments yet.
        </p>
      ) : (
        <ul>
          {comments.map((c) => (
            <AdminCommentItem
              key={c.id}
              comment={c}
              isOwn={!!authenticatedUser && c.userId === authenticatedUser.id}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}
        </ul>
      )}
    </section>
  );
};
