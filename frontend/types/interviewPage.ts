import { InterviewStatus } from "@/types/interviewedApplicant";

export type InterviewedApplicantsDTO = {
  applicantRecordId: string;
  interviewStatus: InterviewStatus;
  applicantFirstName: string;
  applicantLastName: string;
};
