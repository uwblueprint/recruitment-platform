import type {
  ApplicationResult,
  ReviewedApplicantRecordWithReviewerResult,
} from "@/graphql/typeUtils";
import { InterviewStep as InterviewStepValues } from "./constants";

type InterviewStep =
  (typeof InterviewStepValues)[keyof typeof InterviewStepValues];
type NavItem = {
  label: string;
  step: InterviewStep;
  path: string;
};

type HeaderStepConfig = {
  step: string;
  label: string;
  index: number;
};

type StepStatus = "not_started" | "in_progress" | "completed";

type InterviewProgressState = {
  currentStep: InterviewStep;
  stepStatuses: Record<InterviewStep, StepStatus>;
  updateStepStatus: (step: InterviewStep, status: StepStatus) => void;
  currentSubStep: string | null;
  setCurrentSubStep: (subStep: string | null) => void;
  reportDialogOpen: boolean;
  setReportDialogOpen: (open: boolean) => void;
  reportIssueSubmitted: boolean;
  setReportIssueSubmitted: (submitted: boolean) => void;
  candidateName: string | null;
  setCandidateName: (name: string | null) => void;
  application: ApplicationResult | null;
  reviewers: ReviewedApplicantRecordWithReviewerResult[];
  combinedReviewScore: number | null;
  position: string;
};

export type {
  NavItem,
  HeaderStepConfig,
  InterviewStep,
  StepStatus,
  InterviewProgressState,
};
