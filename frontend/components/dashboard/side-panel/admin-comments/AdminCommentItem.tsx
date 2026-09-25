import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { useState } from "react";

import type { AdminCommentResult } from "@/graphql/typeUtils";

import { AdminCommentComposer } from "./AdminCommentComposer";

type AdminCommentItemProps = {
  comment: AdminCommentResult;
  isOwn: boolean;
  onUpdate: (id: string, comment: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const AdminCommentItem = ({
  comment,
  isOwn,
  onUpdate,
  onDelete,
}: AdminCommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const createdAtMs = new Date(comment.createdAt).getTime();
  const updatedAtMs = new Date(comment.updatedAt).getTime();
  const wasEdited =
    Number.isFinite(createdAtMs) &&
    Number.isFinite(updatedAtMs) &&
    updatedAtMs - createdAtMs >= 1000;

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <li className="border-b border-neutral-200 py-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-neutral-500">
          {isOwn ? "Admin (You)" : "Admin"}
          {wasEdited ? " · edited" : ""}
        </p>

        {isOwn && !isEditing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-blue hover:opacity-80"
              aria-label="Edit comment"
            >
              <EditOutlined sx={{ fontSize: 15 }} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-blue hover:opacity-80 disabled:opacity-40"
              aria-label="Delete comment"
            >
              <DeleteOutline sx={{ fontSize: 15 }} />
            </button>
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <div className="mt-2">
          <AdminCommentComposer
            initialValue={comment.comment}
            submitLabel="Save"
            autoFocus
            onSubmit={async (next) => {
              await onUpdate(comment.id, next);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-[140%] text-neutral-800">
          {comment.comment}
        </p>
      )}
    </li>
  );
};
