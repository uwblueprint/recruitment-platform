import { useCallback } from "react";
import { skipToken, useMutation, useQuery } from "@apollo/client/react";
import {
  InterviewNotesDocument,
  UploadInterviewNotesDocument,
  type UploadInterviewNotesMutation,
  type UploadInterviewNotesMutationVariables,
  type InterviewNotesQuery,
  type InterviewNotesQueryVariables,
  type InterviewNotesResult,
} from "@/graphql/typeUtils";

type UseInterviewNotesResult = {
  notes: InterviewNotesResult | null;
  isLoading: boolean;
  hasError: boolean;
  uploadNotes: (file: File) => void;
  uploadError: { message: string } | undefined;
  isUploading: boolean;
};

const useInterviewNotes = (
  interviewedApplicantRecordId: string | null
): UseInterviewNotesResult => {
  const { data, loading, error } = useQuery<
    InterviewNotesQuery,
    InterviewNotesQueryVariables
  >(
    InterviewNotesDocument,
    !interviewedApplicantRecordId
      ? skipToken
      : {
          variables: { interviewedApplicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
          notifyOnNetworkStatusChange: false,
        }
  );

  const [upload, { loading: isUploading, error: uploadError }] = useMutation<
    UploadInterviewNotesMutation,
    UploadInterviewNotesMutationVariables
  >(UploadInterviewNotesDocument, {
    context: { refreshAuth: true },
    awaitRefetchQueries: true,
    // Apollo exposes failures through `uploadError`; event handlers need no catch.
    onError: () => {},
  });

  const uploadNotes = useCallback(
    (file: File): void => {
      if (!interviewedApplicantRecordId) return;
      void upload({
        variables: { interviewedApplicantRecordId, file },
        refetchQueries: [
          {
            query: InterviewNotesDocument,
            variables: { interviewedApplicantRecordId },
            context: { refreshAuth: true },
          },
        ],
      });
    },
    [interviewedApplicantRecordId, upload]
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!interviewedApplicantRecordId) {
    return {
      notes: null,
      isLoading: false,
      hasError: false,
      uploadNotes,
      isUploading,
      uploadError,
    };
  }

  return {
    // No uploaded notes is a valid empty state, not an error.
    notes: !loading && !error ? data?.interviewNotes ?? null : null,
    isLoading: loading,
    hasError: !!error,
    uploadNotes,
    isUploading,
    uploadError,
  };
};

export default useInterviewNotes;
