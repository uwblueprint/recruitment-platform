import { ApplicationStatus, SkillCategory } from "./applicantRecord";
import { Review, ReviewStatus } from "./reviewedApplicantRecord";
import { UserDTO } from "./user";

export type ReviewDashboardSortBy =
  | "FIRST_NAME"
  | "LAST_NAME"
  | "CHOICE"
  | "TIMES_APPLIED"
  | "REVIEWER"
  | "TOTAL_SCORE"
  | "APPLICATION_STATUS";

export type SortDirection = "ASC" | "DESC";

export type ReviewDetails = {
  reviewer: UserDTO;
  review: Review;
  reviewStatus: ReviewStatus;
};

export type ReviewDashboardRowDTO = {
  firstName: string;
  lastName: string;
  position: string;
  timesApplied: string;
  applicationStatus: ApplicationStatus;
  choice: number;
  reviewers: UserDTO[];
  totalScore: number | null;
};

export type ReviewDashboardSidePanelDTO = {
  firstName: string;
  lastName: string;
  position: string;
  program: string;
  resumeUrl: string;
  applicationStatus: ApplicationStatus;
  skillCategory: SkillCategory | null;
  reviewDetails: ReviewDetails[];
};
