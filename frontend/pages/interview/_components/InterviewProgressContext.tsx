import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/router";
import useInterviewProfile from "@/APIClients/useInterviewProfile";
import { InterviewStep, INTERVIEW_NAV_ITEMS } from "./constants";
import {
  InterviewProgressState,
  InterviewStep as InterviewStepType,
  StepStatus,
} from "./types";
import { getApplicantRecordId } from "@/pages/review/_components/utils";

export const InterviewProgressContext =
  createContext<InterviewProgressState | null>(null);

const PATH_TO_STEP = INTERVIEW_NAV_ITEMS.reduce<
  Record<string, InterviewStepType>
>((acc, item) => {
  acc[item.path] = item.step;
  return acc;
}, {});

const INITIAL_STATUSES: Record<InterviewStepType, StepStatus> = {
  [InterviewStep.PROFILE]: "not_started",
  [InterviewStep.ASSESSMENT]: "not_started",
  [InterviewStep.REPORT]: "not_started",
};

interface InterviewProgressProviderProps {
  children: ReactNode;
}

export const InterviewProgressProvider = ({
  children,
}: InterviewProgressProviderProps) => {
  const router = useRouter();
  const [stepStatuses, setStepStatuses] = useState(INITIAL_STATUSES);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportIssueSubmitted, setReportIssueSubmitted] = useState(false);
  const [subStepsBySection, setSubStepsBySection] = useState<
    Partial<Record<InterviewStepType, string>>
  >({});

  // The record id is the path segment shared across the profile/assessment/report
  // tabs, so this provider (which lives in the persistent layout) fetches once per
  // candidate. Tab switches reuse the in-memory data instead of refetching, which
  // avoids the blank flash on navigating back to the profile.
  const applicantRecordId = router.isReady
    ? getApplicantRecordId(router.query)
    : undefined;

  const {
    application,
    reviewers,
    combinedReviewScore,
    position,
    candidateName,
  } = useInterviewProfile(applicantRecordId);

  const currentStep = PATH_TO_STEP[router.pathname] ?? InterviewStep.PROFILE;

  // Derive current sub-step from the section-keyed map — no reset needed on navigation
  // since each section has its own slot. Navigating away and back preserves sub-step state.
  const currentSubStep = subStepsBySection[currentStep];

  const setCurrentSubStep = (subStep?: string) => {
    setSubStepsBySection((prev) => ({ ...prev, [currentStep]: subStep }));
  };

  const updateStepStatus = (step: InterviewStepType, status: StepStatus) => {
    setStepStatuses((prev) => ({ ...prev, [step]: status }));
  };

  return (
    <InterviewProgressContext.Provider
      value={{
        currentStep,
        stepStatuses,
        updateStepStatus,
        currentSubStep,
        setCurrentSubStep,
        reportDialogOpen,
        setReportDialogOpen,
        reportIssueSubmitted,
        setReportIssueSubmitted,
        candidateName,
        application,
        reviewers,
        combinedReviewScore,
        position,
      }}
    >
      {children}
    </InterviewProgressContext.Provider>
  );
};

export const useInterviewProgress = (): InterviewProgressState => {
  const context = useContext(InterviewProgressContext);
  if (!context) {
    throw new Error(
      "useInterviewProgress must be used within an InterviewProgressProvider"
    );
  }
  return context;
};
