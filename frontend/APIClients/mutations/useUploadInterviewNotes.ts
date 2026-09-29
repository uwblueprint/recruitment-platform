import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  InterviewNotesDocument,
  UploadInterviewNotesDocument,
  type UploadInterviewNotesMutation,
  type UploadInterviewNotesMutationVariables,
} from "@/graphql/typeUtils";

export default function useUploadInterviewNotes(recordId: string | null) {
  const [mutate, { data, called, loading, error }] = useMutation<
    UploadInterviewNotesMutation,
    UploadInterviewNotesMutationVariables
  >(UploadInterviewNotesDocument, {
    context: { refreshAuth: true },
    // Consumers render mutation errors directly.
    onError: () => {},
  });
  const uploadNotes = useCallback(
    (file: File) => {
      if (!recordId || loading) return;
      void mutate({
        variables: { interviewedApplicantRecordId: recordId, file },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: InterviewNotesDocument,
            variables: { interviewedApplicantRecordId: recordId },
            context: { refreshAuth: true },
          },
        ],
      });
    },
    [recordId, loading, mutate]
  );

  return {
    uploadNotes,
    data: data?.uploadInterviewNotes,
    loading,
    error:
      error ??
      (called && !loading && !data?.uploadInterviewNotes
        ? new Error("No uploaded interview notes returned")
        : undefined),
  };
}
