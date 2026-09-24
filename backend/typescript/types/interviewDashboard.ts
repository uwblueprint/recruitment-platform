import { ApplicationStatus } from "./applicantRecord";
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
