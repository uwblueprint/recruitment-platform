import useInterviewNotes from "@/APIClients/useInterviewNotes";

type InterviewNotesTabProps = {
  interviewedApplicantRecordId: string | null;
};

export const InterviewNotesTab = ({
  interviewedApplicantRecordId,
}: InterviewNotesTabProps) => {
  const {
    data: notes,
    loading: isLoading,
    error,
  } = useInterviewNotes(interviewedApplicantRecordId);

  if (isLoading) {
    return (
      <div className="flex p-12 items-center justify-center text-sm text-neutral-500">
        Loading interview notes…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex p-12 items-center justify-center text-sm text-alert-errorText">
        Failed to load interview notes.
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="flex p-12 items-center justify-center px-4 text-center text-base font-semibold text-neutral-500">
        No interview notes have been uploaded yet.
      </div>
    );
  }

  return (
    <iframe
      src={notes.signedUrl}
      title={notes.fileName}
      className="h-[700px] w-full rounded border border-neutral-200"
    />
  );
};
