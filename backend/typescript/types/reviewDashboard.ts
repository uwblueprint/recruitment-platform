import { ValueOf } from "../utilities/typingUtils";
import { ApplicationStatus, SkillCategory } from "./applicantRecord";
import { Review, ReviewStatus } from "./reviewedApplicantRecord";
import { UserDTO } from "./user";

export const ReviewDashboardSortByEnum = {
  FIRST_NAME: "FIRST_NAME",
  LAST_NAME: "LAST_NAME",
  CHOICE: "CHOICE",
  TIMES_APPLIED: "TIMES_APPLIED",
  REVIEWER_1: "REVIEWER_1",
  REVIEWER_2: "REVIEWER_2",
  TOTAL_SCORE: "TOTAL_SCORE",
  APPLICATION_STATUS: "APPLICATION_STATUS",
} as const;

export type ReviewDashboardSortBy = ValueOf<typeof ReviewDashboardSortByEnum>;

export type ReviewDetails = {
  reviewer: UserDTO;
  review: Review;
  reviewStatus: ReviewStatus;
};

export type ReviewDashboardRowDTO = {
  applicantRecordId: string;
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
  academicYear: string;
  resumeUrl: string;
  applicationStatus: ApplicationStatus;
  skillCategory: SkillCategory | null;
  reviewDetails: ReviewDetails[];
};

export type FilterOption = {
  value: string;
  label: string;
};

export type ReviewDashboardFilterOptionsDTO = {
  positions: FilterOption[];
  applicationStatuses: FilterOption[];
  skillCategories: FilterOption[];
  scoreRanges: FilterOption[];
  years: FilterOption[];
};

export type ReviewDashboardFilters = {
  positions?: string[];
  applicationStatuses?: ApplicationStatus[];
  skillCategories?: SkillCategory[];
  scoreRanges?: string[];
  years?: string[];
  bookmarked?: boolean;
};
