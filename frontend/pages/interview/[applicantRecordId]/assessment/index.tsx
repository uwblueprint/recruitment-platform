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
import { ScoresPanel } from "../../_components/assessment/ScoresPanel";
import NotesUploader from "../../_components/assessment/NotesUploader";
import {
  AssessmentProvider,
  useInterviewAssessment,
} from "./AssessmentContext";
import { isScoreFormComplete } from "../../_components/assessment/constants";

const SCORES = AssessmentHeaderStep.SCORES;
const NOTES = AssessmentHeaderStep.NOTES;
const SUBMITTED = "SUBMITTED";

// ---------------------------------------------------------------------------
// Footer — reads from both InterviewProgressContext and AssessmentContext
// ---------------------------------------------------------------------------

const AssessmentFooter = () => {
  const { currentSubStep, setCurrentSubStep } = useInterviewProgress();
  const { form, isSubmitting, isUploadingNotes, submitScores } =
    useInterviewAssessment();

  const formComplete = isScoreFormComplete(form);

  const handleSubmitAndContinue = async () => {
    try {
      await submitScores();
      setCurrentSubStep(NOTES);
    } catch {
      // error already set in context, stay on SCORES
    }
  };

  switch (currentSubStep) {
    case SUBMITTED:
      return null;
    case NOTES:
      return (
        <InterviewFooter
          onBack={() => setCurrentSubStep(SCORES)}
          backLabel="Previous Page"
          onContinue={() => setCurrentSubStep(SUBMITTED)}
          continueLabel={isUploadingNotes ? "Uploading…" : "Submit & Finish"}
          continueDisabled={isUploadingNotes}
        />
      );
    default:
      return (
        <InterviewFooter
          onBack={() => {}}
          onContinue={handleSubmitAndContinue}
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
  const { currentSubStep } = useInterviewProgress();
  const { form, setForm, recordId, error, setIsUploadingNotes } =
    useInterviewAssessment();

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
