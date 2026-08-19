import useInterviewNotes from "./hooks/useInterviewNotes";

type InterviewNotesTabProps = {
  interviewNotesId: string | null;
};

export const InterviewNotesTab = ({
  interviewNotesId,
}: InterviewNotesTabProps) => {
  const { notes, isLoading, hasError } = useInterviewNotes(interviewNotesId);

  if (!interviewNotesId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        No interview notes have been uploaded yet.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        Loading interview notes…
      </div>
    );
  }

  if (hasError || !notes) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-alert-errorText">
        Failed to load interview notes.
      </div>
    );
  }

  return (
    <iframe
      src={notes.signedUrl}
      title={notes.fileName}
      className="h-full w-full rounded border border-neutral-200"
    />
  );
};
