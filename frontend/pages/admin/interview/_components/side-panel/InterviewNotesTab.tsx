import useInterviewNotes from "../../../../../components/dashboard/side-panel/hooks/useInterviewNotes";

type InterviewNotesTabProps = {
  interviewedApplicantRecordId: string | null;
};

export const InterviewNotesTab = ({
  interviewedApplicantRecordId,
}: InterviewNotesTabProps) => {
  const { notes, isLoading, hasError } = useInterviewNotes(
    interviewedApplicantRecordId
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        Loading interview notes…
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-alert-errorText">
        Failed to load interview notes.
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        No interview notes have been uploaded yet.
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
