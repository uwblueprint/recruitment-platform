import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/router";
import { getApplicantRecordId } from "@/pages/review/_components/utils";
import InterviewAssessmentAPIClient from "@/APIClients/InterviewAssessmentAPIClient";
import { type InterviewInput } from "@/graphql/typeUtils";
import {
  EMPTY_SCORE_FORM,
  type ScoreFormState,
} from "../../_components/assessment/constants";

export type AssessmentContextValue = {
  form: ScoreFormState;
  setForm: Dispatch<SetStateAction<ScoreFormState>>;
  recordId: string | null;
  isSubmitting: boolean;
  isUploadingNotes: boolean;
  setIsUploadingNotes: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  submitScores: () => Promise<void>;
};

export const AssessmentContext = createContext<AssessmentContextValue | null>(
  null,
);

export const useInterviewAssessment = (): AssessmentContextValue => {
  const ctx = useContext(AssessmentContext);
  if (!ctx)
    throw new Error(
      "useInterviewAssessment must be used inside AssessmentProvider",
    );
  return ctx;
};

export const AssessmentProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const applicantRecordId = router.isReady
    ? getApplicantRecordId(router.query)
    : undefined;

  const [form, setForm] = useState<ScoreFormState>(EMPTY_SCORE_FORM);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingNotes, setIsUploadingNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicantRecordId) return;
    InterviewAssessmentAPIClient.getInterviewedApplicantRecordByApplicantRecordId(
      applicantRecordId,
    )
      .then((record) => {
        setRecordId(record.id);
        const j = record.interviewJson;
        if (j) {
          setForm({
            passionFSG: j.passionFSG ?? "",
            teamPlayer: j.teamPlayer ?? "",
            desireToLearn: j.desireToLearn ?? "",
            skill: j.skill ?? "",
            skillCategory: j.skillCategory ?? "",
            comments: j.comments ?? "",
          });
        }
      })
      .catch((e) => {
        console.error("Failed to load assessment record:", e);
        const detail = e instanceof Error ? e.message : String(e);
        setError(`Failed to load assessment record. ${detail}`);
      });
  }, [applicantRecordId]);

  const submitScores = useCallback(async () => {
    if (!recordId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await InterviewAssessmentAPIClient.submitInterviewScores(
        recordId,
        {
          passionFSG: form.passionFSG === "" ? undefined : form.passionFSG,
          teamPlayer: form.teamPlayer === "" ? undefined : form.teamPlayer,
          desireToLearn:
            form.desireToLearn === "" ? undefined : form.desireToLearn,
          skill: form.skill === "" ? undefined : form.skill,
          skillCategory:
            form.skillCategory === "" ? undefined : form.skillCategory,
          comments: form.comments || undefined,
        } as InterviewInput,
      );
    } catch {
      setError("Failed to submit scores. Please try again.");
      throw new Error("submit failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [recordId, form]);

  return (
    <AssessmentContext.Provider
      value={{
        form,
        setForm,
        recordId,
        isSubmitting,
        isUploadingNotes,
        setIsUploadingNotes,
        error,
        submitScores,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

