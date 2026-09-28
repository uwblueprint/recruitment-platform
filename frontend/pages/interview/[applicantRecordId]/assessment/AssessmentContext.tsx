import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/router";
import { getApplicantRecordId } from "@/pages/review/_components/utils";
import useInterviewAssessmentRecord from "@/APIClients/useInterviewAssessmentRecord";
import useSubmitInterviewScores from "@/APIClients/useSubmitInterviewScores";
import useInterviewNotes from "@/APIClients/useInterviewNotes";
import type { InterviewInput } from "@/graphql/typeUtils";
import {
  EMPTY_SCORE_FORM,
  type ScoreFormState,
} from "../../_components/assessment/constants";

export type AssessmentContextValue = {
  form: ScoreFormState;
  setForm: Dispatch<SetStateAction<ScoreFormState>>;
  recordId: string | null;
  isSubmitting: boolean;
  interviewNotes: ReturnType<typeof useInterviewNotes>;
  error: string | null;
  submitScores: () => Promise<void>;
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

  const { record, hasError: loadFailed } =
    useInterviewAssessmentRecord(applicantRecordId);
  const {
    submitInterviewScores,
    isSubmitting,
    hasError: submitFailed,
  } = useSubmitInterviewScores();
  const recordId = record?.id ?? null;
  const interviewNotes = useInterviewNotes(recordId);

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

  const submitScores = useCallback(async () => {
    if (!recordId) throw new Error("Assessment record is not loaded");
    await submitInterviewScores(recordId, {
      passionFSG: form.passionFSG === "" ? undefined : form.passionFSG,
      teamPlayer: form.teamPlayer === "" ? undefined : form.teamPlayer,
      desireToLearn: form.desireToLearn === "" ? undefined : form.desireToLearn,
      skill: form.skill === "" ? undefined : form.skill,
      skillCategory: form.skillCategory === "" ? undefined : form.skillCategory,
      comments: form.comments || undefined,
    } as InterviewInput);
  }, [recordId, form, submitInterviewScores]);

  const error = loadFailed
    ? "Failed to load assessment record. Please try again."
    : submitFailed
    ? "Failed to submit scores. Please try again."
    : null;

  return (
    <AssessmentContext.Provider
      value={{
        form,
        setForm,
        recordId,
        isSubmitting,
        interviewNotes,
        error,
        submitScores,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
