import { ValueOf } from "../utilities/typingUtils";

export const InterviewGroupStatusEnum = {
  READY_TO_INTERVIEW: "Ready to Interview",
  INVITES_SENT: "Invites Sent",
  AVAILABILITY_PENDING: "Availability Pending",
} as const;

export type InterviewGroupStatus = ValueOf<typeof InterviewGroupStatusEnum>;
