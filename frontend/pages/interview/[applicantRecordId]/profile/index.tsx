import { NextPageWithLayout } from "@/pages/_app";
import {
  getInterviewLayout,
  InterviewHeader,
} from "../../_components/layout";
import {
  PROFILE_HEADER_STEPS,
  InterviewHeaderStep,
} from "../../_components/constants";
import { useInterviewProgress } from "../../_components";
import {
  ProfileCommentsPanel,
  ProfileFooter,
  ProfileInfoPanel,
  ProfileScoresPanel,
} from "./_components";


const InterviewProfilePage: NextPageWithLayout = () => {
  const {
    currentSubStep,
    application,
    reviewers,
    combinedReviewScore,
    position,
  } = useInterviewProgress();

  const subStep = currentSubStep ?? InterviewHeaderStep.INFO;

  switch (subStep) {
    case InterviewHeaderStep.SCORING:
      return (
        <ProfileScoresPanel
          reviewers={reviewers}
          combinedReviewScore={combinedReviewScore}
        />
      );
    case InterviewHeaderStep.COMMENTS:
      return <ProfileCommentsPanel reviewers={reviewers} />;
    case InterviewHeaderStep.INFO:
    default:
      return <ProfileInfoPanel application={application} position={position} />;
  }
};

InterviewProfilePage.getLayout = getInterviewLayout(
  <InterviewHeader
    steps={PROFILE_HEADER_STEPS}
    currentStep={InterviewHeaderStep.INFO}
  />,
  <ProfileFooter />,
);

export default InterviewProfilePage;
