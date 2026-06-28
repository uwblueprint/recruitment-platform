import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

import InterviewAssessmentAPIClient from "@/APIClients/InterviewAssessmentAPIClient";
import { Button } from "@/components/common/Button";
import type { InterviewNotesResult } from "@/graphql/typeUtils";

import {
  INTERVIEW_NOTES_DROPZONE_ACCEPT,
  INTERVIEW_NOTES_MAX_BYTES,
} from "./constants";

// `INTERVIEW_NOTES_MAX_BYTES` is duplicated in
// `backend/typescript/constants/interviewNotes.ts`. Defensive client-side
// check so the dropzone can reject oversize files locally without a round
// trip; the server is still the trust boundary.

type Props = {
  interviewedApplicantRecordId: string | null;
  /**
   * Notifies the parent whenever an upload is in flight, so the footer can
   * disable "Submit & Finish" until the file is persisted server-side.
   */
  onUploadingChange?: (uploading: boolean) => void;
};

type RemoteState =
  // `recordId` is stamped onto each loaded state so we can derive a fresh
  // "loading" display whenever `interviewedApplicantRecordId` changes
  // without calling setState synchronously inside an effect (which trips
  // react-hooks/set-state-in-effect on cascading renders).
  | { kind: "empty"; recordId: string }
  | { kind: "filled"; recordId: string; notes: InterviewNotesResult }
  | { kind: "error"; recordId: string; message: string };

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ---- Inline icons ---------------------------------------------------------
// Kept local to avoid polluting the shared icons folder with one-off marks
// only this page uses.

const CloudUploadIcon = () => (
  <svg
    width="48"
    height="36"
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M37.5 14.25h-1.65A12 12 0 0 0 12.75 12 9 9 0 0 0 13.5 30h2.25M24 19.5v15m0 0-5.25-5.25M24 34.5l5.25-5.25M37.5 31.5a7.5 7.5 0 0 0 0-15"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SuccessCheckIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="16" fill="#16A34A" />
    <path
      d="m10 16.5 4 4 8-9"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PdfBadgeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 1.5h6L13 5.5v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
      fill="#3B82F6"
    />
    <path d="M9 1.5v4h4" stroke="white" strokeWidth="1" fill="none" />
  </svg>
);

const CloseXIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="m3.5 3.5 7 7m0-7-7 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

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
  onUploadingChange,
}: Props) => {
  const [remote, setRemote] = useState<RemoteState | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Surface upload-in-flight state to the parent (used to disable Submit &
  // Finish). Effect, not call-in-render, to avoid setState-during-render.
  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  // Initial fetch of any existing notes file. setState happens only inside
  // async callbacks (allowed by react-hooks/set-state-in-effect) — the
  // visible "loading" state is derived below by comparing the stamped
  // `recordId` on `remote` against the current prop.
  useEffect(() => {
    if (!interviewedApplicantRecordId) return;
    const recordId = interviewedApplicantRecordId;
    let cancelled = false;
    InterviewAssessmentAPIClient.getInterviewNotes(recordId)
      .then((notes) => {
        if (cancelled) return;
        setRemote(
          notes
            ? { kind: "filled", recordId, notes }
            : { kind: "empty", recordId },
        );
      })
      .catch((e) => {
        if (cancelled) return;
        const detail = e instanceof Error ? e.message : String(e);
        setRemote({ kind: "error", recordId, message: detail });
      });
    return () => {
      cancelled = true;
    };
  }, [interviewedApplicantRecordId]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!interviewedApplicantRecordId) return;
      const recordId = interviewedApplicantRecordId;
      setUploadError(null);
      setIsUploading(true);
      try {
        const result = await InterviewAssessmentAPIClient.uploadInterviewNotes(
          recordId,
          file,
        );
        setRemote({ kind: "filled", recordId, notes: result });
      } catch (e) {
        const detail = e instanceof Error ? e.message : String(e);
        setUploadError(detail);
      } finally {
        setIsUploading(false);
      }
    },
    [interviewedApplicantRecordId],
  );

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const code = rejections[0].errors[0]?.code ?? "unknown";
        const map: Record<string, string> = {
          "file-invalid-type": "Only PDF files are accepted.",
          "file-too-large": `File exceeds the ${formatBytes(
            INTERVIEW_NOTES_MAX_BYTES,
          )} limit.`,
          "too-many-files": "Upload one file at a time.",
        };
        setUploadError(map[code] ?? `Upload failed: ${code}`);
        return;
      }
      if (accepted.length > 0) {
        void handleFile(accepted[0]);
      }
    },
    [handleFile],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: INTERVIEW_NOTES_DROPZONE_ACCEPT,
    maxFiles: 1,
    maxSize: INTERVIEW_NOTES_MAX_BYTES,
    multiple: false,
    // We render our own button; suppress click-anywhere so users only open the
    // picker via the explicit Browse/Replace control.
    noClick: true,
    noKeyboard: true,
    disabled: isUploading || !interviewedApplicantRecordId,
  });

  // Derive a fresh "loading" view whenever the prop changes before the
  // matching fetch resolves. This replaces a synchronous setState in the
  // effect body and keeps stale data from briefly leaking across records.
  const loaded =
    remote && remote.recordId === interviewedApplicantRecordId ? remote : null;

  if (!loaded) {
    return (
      <p className="font-poppins text-sm text-charcoal-500">Loading notes…</p>
    );
  }
  if (loaded.kind === "error") {
    return (
      <p className="font-poppins text-sm text-error">
        Failed to load existing notes: {loaded.message}
      </p>
    );
  }

  const isFilled = loaded.kind === "filled";

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Heading row — green check appears only once a file has been attached. */}
      {isFilled && (
        <div className="-mb-1">
          <SuccessCheckIcon />
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
              fileName={loaded.notes.fileName}
              signedUrl={loaded.notes.signedUrl}
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

      {uploadError && (
        <p className="font-poppins text-sm text-error">{uploadError}</p>
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
        // Prevent the click from also triggering the surrounding dropzone /
        // anchor — we just want to open the file picker.
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
