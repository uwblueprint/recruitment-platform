import { ValueOf } from "../utilities/typingUtils";
import { UserDTO } from "./user";

export const InterviewGroupStatusEnum = {
  READY_TO_INTERVIEW: "READY_TO_INTERVIEW",
  INVITES_SENT: "INVITES_SENT",
  AVAILABILITY_PENDING: "AVAILABILITY_PENDING",
} as const;

export type InterviewGroupStatus = ValueOf<typeof InterviewGroupStatusEnum>;

export type InterviewGroupDTO = {
  id: string;
  schedulingLink?: string;
  status: InterviewGroupStatus;
};

export type CreateInterviewGroupDTO = Partial<Omit<InterviewGroupDTO, "id">>;
export type UpdateInterviewGroupDTO = Partial<Omit<InterviewGroupDTO, "id">>;

export type InterviewInviteeDTO = {
  firstName: string;
  lastName: string;
  position: string;
};

export type InterviewInviteDTO = {
  id: string;
  interviewers: UserDTO[];
  interviewees: InterviewInviteeDTO[];
  position: string;
  schedulingLink?: string;
  status: InterviewGroupStatus;
};
