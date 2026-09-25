import NearMeOutlined from "@mui/icons-material/NearMeOutlined";
import { KeyboardEvent, useState } from "react";

type AdminCommentComposerProps = {
  initialValue?: string;
  submitLabel?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit: (comment: string) => Promise<void> | void;
  onCancel?: () => void;
};

export const AdminCommentComposer = ({
  initialValue = "",
  submitLabel = "Post",
  placeholder = "Add a comment...",
  autoFocus = false,
  onSubmit,
  onCancel,
}: AdminCommentComposerProps) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = value.trim().length > 0 && !isSubmitting;
  const isCreateMode = !onCancel;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(value.trim());
      setValue("");
    } catch {
      setError("Failed to save comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isCreateMode ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleCreateInputKeyDown}
            placeholder={placeholder}
            className="h-9 flex-1 rounded border border-neutral-200 px-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-blue focus:outline-none"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit}
            className="flex h-8 w-8 items-center justify-center rounded text-blue hover:bg-surface-muted disabled:opacity-40"
            aria-label="Post comment"
          >
            <NearMeOutlined sx={{ fontSize: 18 }} />
          </button>
        </div>
      ) : (
        <>
          <textarea
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-y rounded border border-neutral-200 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-blue focus:outline-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded px-3 py-1 text-sm text-neutral-700 hover:bg-surface-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!canSubmit}
              className="rounded bg-blue px-3 py-1 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </>
      )}

      {error ? <p className="text-xs text-alert-errorText">{error}</p> : null}
    </div>
  );
};
