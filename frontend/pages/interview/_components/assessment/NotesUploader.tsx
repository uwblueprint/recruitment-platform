import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

import type { InterviewNotesState } from "./types";
import { Button } from "@/components/common/Button";
import { CloudUploadIcon } from "@/components/icons/cloud-upload.icon";
import { CheckIcon } from "@/components/icons/check.icon";
import { PdfBadgeIcon } from "@/components/icons/pdf-badge.icon";
import { CloseXIcon } from "@/components/icons/close-x.icon";

import {
  INTERVIEW_NOTES_DROPZONE_ACCEPT,
  INTERVIEW_NOTES_MAX_BYTES,
} from "./constants";

type Props = {
  interviewedApplicantRecordId: string | null;
} & InterviewNotesState;

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ---- Shared sub-components ------------------------------------------------

const OrDivider = () => (
  <div className="flex w-full items-center gap-3 px-8 text-charcoal-500">
    <span className="h-px flex-1 bg-charcoal-200" />
    <span className="font-poppins text-sm">Or</span>
    <span className="h-px flex-1 bg-charcoal-200" />
  </div>
);

// ---- Main component -------------------------------------------------------

export const NotesUploader = ({
  interviewedApplicantRecordId,
  notes,
  isLoading,
  hasError,
  uploadNotes,
  isUploading,
  uploadError,
}: Props) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const code = rejections[0].errors[0]?.code ?? "unknown";
        const map: Record<string, string> = {
          "file-invalid-type": "Only PDF files are accepted.",
          "file-too-large": `File exceeds the ${formatBytes(
            INTERVIEW_NOTES_MAX_BYTES
          )} limit.`,
          "too-many-files": "Upload one file at a time.",
        };
        setValidationError(map[code] ?? `Upload failed: ${code}`);
        return;
      }
      if (accepted.length > 0) {
        setValidationError(null);
        uploadNotes(accepted[0]);
      }
    },
    [uploadNotes]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: INTERVIEW_NOTES_DROPZONE_ACCEPT,
    maxFiles: 1,
    maxSize: INTERVIEW_NOTES_MAX_BYTES,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    disabled: isUploading || !interviewedApplicantRecordId,
  });

  if (!interviewedApplicantRecordId || isLoading) {
    return (
      <p className="font-poppins text-sm text-charcoal-500">Loading notes…</p>
    );
  }
  if (hasError) {
    return (
      <p className="font-poppins text-sm text-error">
        Failed to load existing notes. Please try again.
      </p>
    );
  }

  const isFilled = notes !== null;
  const errorMessage = validationError ?? uploadError?.message;

  return (
    <div className="flex w-full flex-col gap-4">
      {isFilled && (
        <div className="-mb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-green-500 bg-green-500">
            <CheckIcon className="h-5 w-5 text-white" />
          </span>
        </div>
      )}
      <h2 className="font-poppins text-[28px] font-semibold leading-[140%] text-neutral-800">
        {isFilled ? "Notes have been submitted" : "Submit interview notes"}
      </h2>
      <p className="font-poppins text-[15px] leading-[140%] text-charcoal-500">
        Submit a PDF of notes taken during the interview.
      </p>

      <div
        {...getRootProps()}
        className={[
          "mt-2 flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          isDragActive
            ? "border-blue bg-sky-100"
            : "border-charcoal-300 bg-white",
          isUploading || !interviewedApplicantRecordId ? "opacity-70" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />

        {isFilled ? (
          <>
            <FileChip
              fileName={notes.fileName}
              signedUrl={notes.signedUrl}
              onRemove={open}
              disabled={isUploading}
            />
            <OrDivider />
            <Button
              size="sm"
              variant="secondary"
              onClick={open}
              disabled={isUploading}
            >
              {isUploading ? "Uploading…" : "Select a different file"}
            </Button>
          </>
        ) : (
          <>
            <CloudUploadIcon />
            <p className="font-poppins text-[15px] text-charcoal-500">
              {isDragActive ? "Drop the PDF here" : "Drag and drop file"}
            </p>
            <OrDivider />
            <Button
              size="sm"
              variant="secondary"
              onClick={open}
              disabled={isUploading || !interviewedApplicantRecordId}
            >
              {isUploading ? "Uploading…" : "Browse files"}
            </Button>
          </>
        )}
      </div>

      {errorMessage && (
        <p className="font-poppins text-sm text-error">{errorMessage}</p>
      )}
    </div>
  );
};

// File chip rendered in the filled state — shows the PDF name with a link to
// the signed URL, plus an × that triggers the replace flow (we don't expose a
// "detach without replacing" path because the backend has no delete endpoint
// for notes and "Submit & Finish" requires a file to be present per the Figma
// flow).
const FileChip = ({
  fileName,
  signedUrl,
  onRemove,
  disabled,
}: {
  fileName: string;
  signedUrl: string;
  onRemove: () => void;
  disabled?: boolean;
}) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5">
    <span className="text-blue">
      <PdfBadgeIcon />
    </span>
    <a
      href={signedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="max-w-[260px] truncate font-poppins text-sm text-blue hover:underline"
      title={fileName}
    >
      {fileName}
    </a>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onRemove();
      }}
      disabled={disabled}
      aria-label="Replace file"
      className="text-blue transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <CloseXIcon />
    </button>
  </div>
);

export default NotesUploader;
