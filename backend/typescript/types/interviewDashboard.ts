import { ValueOf } from "../utilities/typingUtils";
import { ApplicationStatus } from "./applicantRecord";
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
  interviewers: UserDTO[];
  interviewScore: number | null;
};
