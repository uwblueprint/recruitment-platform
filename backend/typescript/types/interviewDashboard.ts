import { ApplicationStatus, SkillCategory } from "./applicantRecord";
import { Interview, InterviewStatus } from "./interviewedApplicantRecord";
import { UserDTO } from "./user";

export type InterviewDashboardRowDTO = {
  applicantRecordId: string;
  firstName: string;
  lastName: string;
  position: string;
  applicationStatus: ApplicationStatus;
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
  interviewNotesId: string | null;
  interviewDate: Date | null;
};
