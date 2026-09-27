import { Button } from "@/components/common/Button";
import { Dialogue } from "@/components/common/Dialogue";

type DeleteCommentDialogueProps = {
  open: boolean;
  isSubmitting: boolean;
  errorText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteCommentDialogue = ({
  open,
  isSubmitting,
  errorText,
  onClose,
  onConfirm,
}: DeleteCommentDialogueProps) => (
  <Dialogue
    open={open}
    onClose={onClose}
    header="Delete this comment?"
    text="This action cannot be undone. Please confirm before continuing."
    errorText={errorText}
  >
    <div className="flex w-full justify-center gap-4">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isSubmitting}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={isSubmitting}
        onClick={onConfirm}
      >
        {isSubmitting ? "Deleting..." : "Confirm"}
      </Button>
    </div>
  </Dialogue>
);
