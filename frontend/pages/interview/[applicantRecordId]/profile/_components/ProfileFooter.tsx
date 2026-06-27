import { useRouter } from "next/router";
import { InterviewFooter } from "../../../_components/layout";
import { useInterviewProgress } from "../../../_components";
import { InterviewHeaderStep } from "../../../_components/constants";

export const ProfileFooter = () => {
  const router = useRouter();
  const { currentSubStep, setCurrentSubStep } = useInterviewProgress();
  const subStep = currentSubStep ?? InterviewHeaderStep.INFO;

  if (subStep === InterviewHeaderStep.SCORING) {
    return (
      <InterviewFooter
        onBack={() => setCurrentSubStep(InterviewHeaderStep.INFO)}
        backLabel="Previous Page"
        onContinue={() => setCurrentSubStep(InterviewHeaderStep.COMMENTS)}
      />
    );
  }

  if (subStep === InterviewHeaderStep.COMMENTS) {
    return (
      <InterviewFooter
        onBack={() => setCurrentSubStep(InterviewHeaderStep.SCORING)}
        backLabel="Previous Page"
      />
    );
  }

  return (
    <InterviewFooter
      onBack={() => router.push("/admin")}
      backLabel="Back to home"
      onContinue={() => setCurrentSubStep(InterviewHeaderStep.SCORING)}
    />
  );
};
