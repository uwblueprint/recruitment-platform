import { Button } from "@/components/common/Button";
import { Dialogue } from "@/components/common/Dialogue";

type RejectApplicantDialogueProps = {
  open: boolean;
  isSubmitting: boolean;
  errorText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const RejectApplicantDialogue = ({
  open,
  isSubmitting,
  errorText,
  onClose,
  onConfirm,
}: RejectApplicantDialogueProps) => (
  <Dialogue
    open={open}
    onClose={onClose}
    header="Reject this applicant?"
    text="Updating this applicant's status to rejected will send them a rejection email. Please confirm before continuing."
    errorText={errorText}
  >
    <div className="flex w-full justify-center gap-4">
      <Button type="button" variant="secondary" size="sm" disabled={isSubmitting} onClick={onClose}>
        Cancel
      </Button>
      <Button type="button" size="sm" disabled={isSubmitting} onClick={onConfirm}>
        {isSubmitting ? "Updating..." : "Confirm"}
      </Button>
    </div>
  </Dialogue>
);
