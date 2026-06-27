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
import {
  ASSESSMENT_HEADER_STEPS,
  AssessmentHeaderStep,
  useInterviewProgress,
} from "../../_components";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import {
  getInterviewLayout,
  InterviewHeader,
  InterviewFooter,
} from "../../_components/layout";
import { Button } from "@/components/common/Button";
import { NextPageWithLayout } from "../../../_app";
import {
  ScoresPanel,
  EMPTY_SCORE_FORM,
  isScoreFormComplete,
  type ScoreFormState,
} from "../../_components/assessment/ScoresPanel";
import NotesUploader from "../../_components/assessment/NotesUploader";
import InterviewAssessmentAPIClient from "@/APIClients/InterviewAssessmentAPIClient";
import { type InterviewInput } from "@/graphql/typeUtils";

// ---------------------------------------------------------------------------
// Assessment-page context — bridges form state between the page body and footer
// ---------------------------------------------------------------------------

type AssessmentContextValue = {
  form: ScoreFormState;
  setForm: Dispatch<SetStateAction<ScoreFormState>>;
  recordId: string | null;
  isSubmitting: boolean;
  // Tracks an in-flight interview-notes upload so the footer can disable
  // "Submit & Finish" until the file is persisted server-side. Lives on the
  // assessment context (not the notes uploader) because the footer is
  // rendered outside the page slot in SplitPanelLayout.
  isUploadingNotes: boolean;
  setIsUploadingNotes: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  submitScores: () => Promise<void>;
};

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const useAssessment = () => {
  const ctx = useContext(AssessmentContext);
  if (!ctx)
    throw new Error("useAssessment must be used inside AssessmentProvider");
  return ctx;
};

const AssessmentProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const applicantRecordId = router.isReady
    ? (router.query.applicantRecordId as string | undefined)
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
        // eslint-disable-next-line no-console
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

// ---------------------------------------------------------------------------
// Sub-step constants
// ---------------------------------------------------------------------------

const SCORES = AssessmentHeaderStep.SCORES;
const NOTES = AssessmentHeaderStep.NOTES;
const SUBMITTED = "SUBMITTED";

// ---------------------------------------------------------------------------
// Footer — reads from both InterviewProgressContext and AssessmentContext
// ---------------------------------------------------------------------------

const AssessmentFooter = () => {
  const { currentSubStep, setCurrentSubStep } = useInterviewProgress();
  const { form, isSubmitting, isUploadingNotes, submitScores } = useAssessment();

  const formComplete = isScoreFormComplete(form);

  switch (currentSubStep) {
    case SUBMITTED:
      return null;
    case NOTES:
      return (
        <InterviewFooter
          onBack={() => setCurrentSubStep(SCORES)}
          backLabel="Previous Page"
          onContinue={() => setCurrentSubStep(SUBMITTED)}
          continueLabel={
            isUploadingNotes ? "Uploading…" : "Submit & Finish"
          }
          continueDisabled={isUploadingNotes}
        />
      );
    default:
      return (
        <InterviewFooter
          onBack={() => {}}
          onContinue={async () => {
            try {
              await submitScores();
              setCurrentSubStep(NOTES);
            } catch {
              // error already set in context, stay on SCORES
            }
          }}
          continueLabel={isSubmitting ? "Submitting..." : "Submit & Continue"}
          continueDisabled={!formComplete || isSubmitting}
        />
      );
  }
};

// ---------------------------------------------------------------------------
// Submitted state
// ---------------------------------------------------------------------------

const AssessmentSubmitted = () => {
  const { setCurrentSubStep } = useInterviewProgress();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p>Assessment Submitted!</p>
      <Button size="sm" onClick={() => setCurrentSubStep(SCORES)}>
        Edit Assessment
      </Button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const InterviewAssessmentPage: NextPageWithLayout = () => {
  const { currentSubStep, setCurrentSubStep } = useInterviewProgress();
  const { form, setForm, recordId, error, setIsUploadingNotes } =
    useAssessment();

  useEffect(() => {
    if (currentSubStep === null) setCurrentSubStep(SCORES);
  }, [currentSubStep, setCurrentSubStep]);

  switch (currentSubStep) {
    case SUBMITTED:
      return <AssessmentSubmitted />;
    case NOTES:
      return (
        <PanelLayout>
          <NotesUploader
            interviewedApplicantRecordId={recordId}
            onUploadingChange={setIsUploadingNotes}
          />
        </PanelLayout>
      );
    default:
      return (
        <PanelLayout>
          {error && (
            <p className="mb-4 font-poppins text-sm text-error">{error}</p>
          )}
          <ScoresPanel form={form} onChange={setForm} />
        </PanelLayout>
      );
  }
};

// Wrap the entire layout in AssessmentProvider so both the page body and the
// footer (which sits outside the page slot in SplitPanelLayout) share state.
InterviewAssessmentPage.getLayout = (page) => (
  <AssessmentProvider>
    {getInterviewLayout(
      <InterviewHeader steps={ASSESSMENT_HEADER_STEPS} />,
      <AssessmentFooter />,
    )(page)}
  </AssessmentProvider>
);

export default InterviewAssessmentPage;
