import { Button } from "@/components/common/Button";
import type { DialogueProps } from "@/components/common/Dialogue";
import Dialog from "@mui/material/Dialog";

export type BulkStatusApplicant = {
  id: string;
  name: string;
  position: string;
  totalScore: number | null;
  // Denominator shown next to the score; the review dashboard scores out of 40.
  maxScore?: number;
};

export type BulkStatusConfirmationDialogueProps = Pick<
  DialogueProps,
  "open" | "onClose" | "errorText" | "header" | "text"
> & {
  // Omit to show a plain confirmation step without the applicant list.
  applicants?: BulkStatusApplicant[];
  confirmLabel: string;
  cancelLabel?: string;
  isSubmitting: boolean;
  onConfirm: () => void;
};

export const BulkStatusConfirmationDialogue = ({
  open,
  header,
  text,
  applicants,
  confirmLabel,
  cancelLabel = "Cancel",
  isSubmitting,
  errorText,
  onClose,
  onConfirm,
}: BulkStatusConfirmationDialogueProps) => (
  <Dialog
    open={open}
    onClose={() => !isSubmitting && onClose()}
    disableEscapeKeyDown={isSubmitting}
    PaperProps={{ sx: { borderRadius: 1, width: applicants ? 560 : 466, maxWidth: "calc(100% - 32px)" } }}
    aria-labelledby="bulk-status-dialogue-title"
    aria-describedby="bulk-status-dialogue-description"
  >
    <div className="flex flex-col px-7 py-8">
      <h2 id="bulk-status-dialogue-title" className="text-center font-poppins text-xl font-medium text-blue">
        {header}
      </h2>
      <p id="bulk-status-dialogue-description" className="mt-2 text-center font-source text-sm text-neutral-800">
        {text}
      </p>
      {applicants ? (
      <div className="mt-6 max-h-64 space-y-2 overflow-y-auto pr-1">
        {applicants.map((applicant) => (
          <div key={applicant.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_4rem] gap-4 bg-neutral-50 px-3 py-4 font-source text-sm">
            <span className="truncate" title={applicant.name}>{applicant.name}</span>
            <span className="truncate" title={applicant.position}>{applicant.position}</span>
            <span className="truncate text-green-700">{applicant.totalScore === null ? "-" : `${applicant.totalScore}/${applicant.maxScore ?? 40}`}</span>
          </div>
        ))}
      </div>
      ) : null}
      {errorText ? <p className="mt-3 text-center text-sm text-alert-errorText">{errorText}</p> : null}
      <div className="mt-7 flex justify-center gap-4">
        <Button type="button" variant="secondary" size="sm" disabled={isSubmitting} onClick={onClose}>{cancelLabel}</Button>
        <Button type="button" size="sm" disabled={isSubmitting} onClick={onConfirm}>
          {isSubmitting ? "Updating..." : confirmLabel}
        </Button>
      </div>
    </div>
  </Dialog>
);
