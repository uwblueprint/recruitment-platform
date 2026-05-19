import { InterviewStatus } from "./interviewedApplicantRecord";
import { InterviewGroupStatus } from "./interviewGroup";
import { UserDTO } from "./user";

export type InterviewedApplicantsDTO = {
  applicantRecordId: string;
  interviewStatus: InterviewStatus;
  applicantFirstName: string;
  applicantLastName: string;
};

export type InterviewPairingsDTO = {
  interviewedGroupId: string;
  interviewGroupStatus: InterviewGroupStatus;
  groupMembers: UserDTO[];
};
