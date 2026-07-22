import { Button } from "@/components/common/Button";
import Dialog from "@mui/material/Dialog";

export type BulkStatusApplicant = {
  id: string;
  name: string;
  position: string;
  totalScore: number | null;
};

type BulkStatusConfirmationDialogueProps = {
  open: boolean;
  title: string;
  description: string;
  applicants: BulkStatusApplicant[];
  confirmLabel: string;
  isSubmitting: boolean;
  errorText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const BulkStatusConfirmationDialogue = ({
  open,
  title,
  description,
  applicants,
  confirmLabel,
  isSubmitting,
  errorText,
  onClose,
  onConfirm,
}: BulkStatusConfirmationDialogueProps) => (
  <Dialog
    open={open}
    onClose={() => !isSubmitting && onClose()}
    disableEscapeKeyDown={isSubmitting}
    PaperProps={{ sx: { borderRadius: 1, width: 560, maxWidth: "calc(100% - 32px)" } }}
    aria-labelledby="bulk-status-dialogue-title"
    aria-describedby="bulk-status-dialogue-description"
  >
    <div className="flex flex-col px-7 py-8">
      <h2 id="bulk-status-dialogue-title" className="text-center font-poppins text-xl font-medium text-blue">
        {title}
      </h2>
      <p id="bulk-status-dialogue-description" className="mt-2 text-center font-source text-sm text-neutral-800">
        {description}
      </p>
      <div className="mt-6 max-h-64 space-y-2 overflow-y-auto pr-1">
        {applicants.map((applicant) => (
          <div key={applicant.id} className="grid grid-cols-[1.2fr_1fr_auto] gap-4 bg-neutral-50 px-3 py-4 font-source text-sm">
            <span>{applicant.name}</span>
            <span>{applicant.position}</span>
            <span className="text-green-700">{applicant.totalScore === null ? "-" : `${applicant.totalScore}/40`}</span>
          </div>
        ))}
      </div>
      {errorText ? <p className="mt-3 text-center text-sm text-alert-errorText">{errorText}</p> : null}
      <div className="mt-7 flex justify-center gap-4">
        <Button type="button" variant="secondary" size="sm" disabled={isSubmitting} onClick={onClose}>Cancel</Button>
        <Button type="button" size="sm" disabled={isSubmitting} onClick={onConfirm}>
          {isSubmitting ? "Updating..." : confirmLabel}
        </Button>
      </div>
    </div>
  </Dialog>
);
