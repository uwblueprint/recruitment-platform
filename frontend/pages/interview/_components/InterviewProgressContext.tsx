import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import ReviewPageAPIClient from "@/APIClients/ReviewPageAPIClient";
import {
  ApplicationResult,
  ReviewedApplicantRecordWithReviewerResult,
} from "@/graphql/typeUtils";
import { InterviewStep, INTERVIEW_NAV_ITEMS } from "./constants";
import {
  InterviewProgressState,
  InterviewStep as InterviewStepType,
  StepStatus,
} from "./types";

const getApplicantRecordId = (
  raw: string | string[] | undefined,
): string | null => {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw;
};

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
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [subStepsBySection, setSubStepsBySection] = useState<
    Record<InterviewStepType, string | null>
  >({
    [InterviewStep.PROFILE]: null,
    [InterviewStep.ASSESSMENT]: null,
    [InterviewStep.REPORT]: null,
  });

  const [application, setApplication] = useState<ApplicationResult | null>(
    null,
  );
  const [reviewers, setReviewers] = useState<
    ReviewedApplicantRecordWithReviewerResult[]
  >([]);
  const [combinedReviewScore, setCombinedReviewScore] = useState<number | null>(
    null,
  );
  const [position, setPosition] = useState("");

  // The record id is the path segment shared across the profile/assessment/report
  // tabs, so this provider (which lives in the persistent layout) fetches once per
  // candidate. Tab switches reuse the in-memory data instead of refetching, which
  // avoids the blank flash on navigating back to the profile.
  const applicantRecordId = getApplicantRecordId(router.query.applicantRecordId);

  useEffect(() => {
    if (!applicantRecordId) return;
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [app, reviewersData] = await Promise.all([
          ReviewPageAPIClient.getApplication(applicantRecordId),
          ReviewPageAPIClient.getReviewedApplicantRecordsByApplicantRecordId(
            applicantRecordId,
          ),
        ]);
        if (cancelled) return;

        setApplication(app);
        setReviewers(reviewersData.reviewedApplicantRecords ?? []);
        setCombinedReviewScore(
          reviewersData.applicantRecord.combinedReviewScore ?? null,
        );
        setPosition(reviewersData.applicantRecord.position ?? "");
        setCandidateName(`${app.firstName} ${app.lastName}`);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load interview profile data:", error);
        setApplication(null);
        setReviewers([]);
        setCombinedReviewScore(null);
        setPosition("");
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [applicantRecordId]);

  const currentStep = PATH_TO_STEP[router.pathname] ?? InterviewStep.PROFILE;

  // Derive current sub-step from the section-keyed map — no reset needed on navigation
  // since each section has its own slot. Navigating away and back preserves sub-step state.
  const currentSubStep = subStepsBySection[currentStep];

  const setCurrentSubStep = (subStep: string | null) => {
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
        setCandidateName,
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
      "useInterviewProgress must be used within an InterviewProgressProvider",
    );
  }
  return context;
};
