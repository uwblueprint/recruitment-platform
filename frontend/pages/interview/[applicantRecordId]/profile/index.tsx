import { PanelLayout } from "@/components/layouts/PanelLayout";
import { NextPageWithLayout } from "../../../_app";
import {
  useInterviewProgress,
  PROFILE_HEADER_STEPS,
  InterviewHeaderStep,
} from "../../_components";
import {
  getInterviewLayout,
  InterviewHeader,
  InterviewFooter,
} from "../../_components/layout";

const InterviewProfilePage: NextPageWithLayout = () => {
  const { currentStep, stepStatuses } = useInterviewProgress();

  return (
    <PanelLayout
      title="Applicant Profile"
      subtitle="Percy Jackson's Application"
    >
      <p>
        Current step: {currentStep}, Status: {stepStatuses[currentStep]}
      </p>
    </PanelLayout>
  );
};

// TODO: footer buttons and currentStep will update as the user moves through
// INFO → SCORING → COMMENTS sub-steps once sub-step state is wired up.
InterviewProfilePage.getLayout = getInterviewLayout(
  <InterviewHeader
    steps={PROFILE_HEADER_STEPS}
    currentStep={InterviewHeaderStep.INFO}
  />,
  <InterviewFooter onBack={() => {}} onContinue={() => {}} />,
);

export default InterviewProfilePage;
