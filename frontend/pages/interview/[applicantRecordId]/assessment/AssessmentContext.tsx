import {
  createContext,
  useContext,
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import { getApplicantRecordId } from "@/pages/review/_components/utils";
import useInterviewNotes from "@/APIClients/useInterviewNotes";
import type { InterviewNotesState } from "../../_components/assessment/types";
import useInterviewAssessmentRecord from "@/APIClients/useInterviewAssessmentRecord";
import useSubmitInterviewScores from "@/APIClients/useSubmitInterviewScores";
import type { InterviewInput } from "@/graphql/typeUtils";
import {
  EMPTY_SCORE_FORM,
  isScoreFormComplete,
  type ScoreFormState,
} from "../../_components/assessment/constants";
import useUploadInterviewNotes from "@/APIClients/useUploadInterviewNotes";

export type AssessmentContextValue = {
  form: ScoreFormState;
  setForm: Dispatch<SetStateAction<ScoreFormState>>;
  recordId: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  error: string | null;
  submitScores: () => Promise<void>;
  interviewNotes: InterviewNotesState;
};

export const AssessmentContext = createContext<AssessmentContextValue | null>(
  null
);

export const useInterviewAssessment = (): AssessmentContextValue => {
  const ctx = useContext(AssessmentContext);
  if (!ctx)
    throw new Error(
      "useInterviewAssessment must be used inside AssessmentProvider"
    );
  return ctx;
};

export const AssessmentProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const applicantRecordId = router.isReady
    ? getApplicantRecordId(router.query)
    : undefined;
  const {
    data: record,
    loading: isLoading,
    error: loadFailed,
  } = useInterviewAssessmentRecord(applicantRecordId);
  const {
    mutate,
    loading: isSubmitting,
    error: submitFailed,
  } = useSubmitInterviewScores();
  const recordId = record?.id ?? null;

  // Derive the initial form from the query; keep user edits separate from
  // cache updates and discard the draft when navigating to another applicant.
  const [draft, setDraft] = useState<{
    applicantRecordId: typeof applicantRecordId;
    form: ScoreFormState | null;
  }>({ applicantRecordId, form: null });
  if (draft.applicantRecordId !== applicantRecordId) {
    setDraft({ applicantRecordId, form: null });
  }
  const saved = record?.interviewJson;
  const initialForm: ScoreFormState = saved
    ? {
        passionFSG: saved.passionFSG ?? "",
        teamPlayer: saved.teamPlayer ?? "",
        desireToLearn: saved.desireToLearn ?? "",
        skill: saved.skill ?? "",
        skillCategory: saved.skillCategory ?? "",
        comments: saved.comments ?? "",
      }
    : EMPTY_SCORE_FORM;
  const form =
    draft.applicantRecordId === applicantRecordId
      ? draft.form ?? initialForm
      : initialForm;
  const setForm: Dispatch<SetStateAction<ScoreFormState>> = (next) => {
    setDraft((previous) => ({
      applicantRecordId,
      form:
        typeof next === "function"
          ? next(
              previous.applicantRecordId === applicantRecordId
                ? previous.form ?? initialForm
                : initialForm
            )
          : next,
    }));
  };

  const formComplete = isScoreFormComplete(form);
  const canSubmit =
    !!recordId && !isLoading && !loadFailed && formComplete && !isSubmitting;

  const submitScores = useCallback(async () => {
    if (!recordId) throw new Error("Assessment record is not loaded");
    if (!canSubmit) throw new Error("Assessment is not ready to submit");
    const { data } = await mutate({
      variables: {
        id: recordId,
        interviewJson: {
          passionFSG: form.passionFSG === "" ? undefined : form.passionFSG,
          teamPlayer: form.teamPlayer === "" ? undefined : form.teamPlayer,
          desireToLearn:
            form.desireToLearn === "" ? undefined : form.desireToLearn,
          skill: form.skill === "" ? undefined : form.skill,
          skillCategory:
            form.skillCategory === "" ? undefined : form.skillCategory,
          comments: form.comments || undefined,
        } as InterviewInput,
      },
    });
    if (!data?.submitInterviewScores)
      throw new Error("No submitted interview scores returned");
  }, [recordId, form, mutate, canSubmit]);

  const error = loadFailed
    ? "Failed to load assessment record. Please try again."
    : submitFailed
    ? "Failed to submit scores. Please try again."
    : null;

  const notesQuery = useInterviewNotes(recordId, {
    // Keep the uploader mounted during its post-upload refresh.
    notifyOnNetworkStatusChange: false,
  });
  const {
    uploadNotes,
    loading: isUploading,
    error: uploadError,
  } = useUploadInterviewNotes(recordId);
  const interviewNotes: InterviewNotesState = {
    notes: notesQuery.data ?? null,
    isLoading: notesQuery.loading,
    hasError: !!notesQuery.error,
    uploadNotes,
    uploadError,
    isUploading,
  };

  return (
    <AssessmentContext.Provider
      value={{
        form,
        setForm,
        recordId,
        isLoading,
        isSubmitting,
        canSubmit,
        error,
        submitScores,
        interviewNotes,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
