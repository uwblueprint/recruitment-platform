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

// Sub-step constants: drive the header bubble (via context) and footer button state.
const SCORES = AssessmentHeaderStep.SCORES;
const NOTES = AssessmentHeaderStep.NOTES;
const SUBMITTED = "SUBMITTED";

const AssessmentFooter = () => {
  const { currentSubStep, setCurrentSubStep } = useInterviewProgress();

  switch (currentSubStep) {
    case SUBMITTED:
      return null;
    case NOTES:
      return (
        <InterviewFooter
          onBack={() => setCurrentSubStep(SCORES)}
          backLabel="Previous Page"
          onContinue={() => setCurrentSubStep(SUBMITTED)}
          continueLabel="Submit & Finish"
        />
      );
    default:
      return (
        <InterviewFooter
          onBack={() => {}}
          onContinue={() => setCurrentSubStep(NOTES)}
          continueLabel="Submit & Continue"
        />
      );
  }
};

// TODO: replace with final designed submitted UI
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

const InterviewAssessmentPage: NextPageWithLayout = () => {
  const { currentSubStep, setCurrentSubStep } = useInterviewProgress();
  if (currentSubStep === null) setCurrentSubStep(SCORES);
  switch (currentSubStep) {
    case SUBMITTED:
      return <AssessmentSubmitted />;
    case NOTES:
      return (
        <PanelLayout
          title="Interview Assessment"
          subtitle="Score the candidate"
        >
          <p>Assessment Notes content goes here.</p>
        </PanelLayout>
      );
    default:
      return (
        <PanelLayout>
          <ScoresPanel />
        </PanelLayout>
      );
  }
};

InterviewAssessmentPage.getLayout = getInterviewLayout(
  <InterviewHeader steps={ASSESSMENT_HEADER_STEPS} />,
  <AssessmentFooter />,
);

export default InterviewAssessmentPage;
