import { ValueOf } from "../utilities/typingUtils";
import { ApplicationStatus, SkillCategory } from "./applicantRecord";
import { Interview, InterviewStatus } from "./interviewedApplicantRecord";
import { ReviewDashboardFilters } from "./reviewDashboard";
import { UserDTO } from "./user";

export const InterviewDashboardSortByEnum = {
  FIRST_NAME: "FIRST_NAME",
  LAST_NAME: "LAST_NAME",
  POSITION: "POSITION",
  INTERVIEWER_1: "INTERVIEWER_1",
  INTERVIEWER_2: "INTERVIEWER_2",
  INTERVIEW_SCORE: "INTERVIEW_SCORE",
  APPLICATION_STATUS: "APPLICATION_STATUS",
} as const;

export type InterviewDashboardSortBy = ValueOf<
  typeof InterviewDashboardSortByEnum
>;

export type InterviewDashboardRowDTO = {
  applicantRecordId: string;
  firstName: string;
  lastName: string;
  position: string;
  applicationStatus: ApplicationStatus;
  isApplicantFlagged: boolean;
  interviewers: UserDTO[];
  interviewScore: number | null;
};

export type InterviewDashboardSidePanelDTO = {
  firstName: string;
  lastName: string;
  term: string;
  program: string;
  position: string;
  resumeUrl: string;
  applicationStatus: ApplicationStatus;
  skillCategory: SkillCategory | null;
  isApplicantFlagged: boolean;
  isShortlistedForOffer: boolean;
  interviewers: UserDTO[];
  interview: Interview | null;
  interviewStatus: InterviewStatus | null;
  interviewScore: number | null;
  interviewedApplicantRecordId: string | null;
  interviewDate: Date | null;
};

/**
 * The review dashboard filters minus score ranges, which are bucketed on the
 * combined review score and don't apply to interview scores.
 */
export type InterviewDashboardFilters = Omit<
  ReviewDashboardFilters,
  "scoreRanges"
>;

export type InterviewDashboardCountsDTO = {
  all: number;
  shortlisted: number;
  conflicts: number;
};
