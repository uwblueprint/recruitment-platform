import {
  InterviewGroupStatus,
  InterviewStatus,
  ReviewStatus,
} from "@/graphql/typeUtils";

export const TABS = ["Application Review", "Interview Review", "Interview Pairing"] as const;
export type Tab = (typeof TABS)[number];

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  [ReviewStatus.Todo]: "Needs Review",
  [ReviewStatus.InProgress]: "In Progress",
  [ReviewStatus.Done]: "Completed",
  [ReviewStatus.Conflict]: "Conflict",
};

export const INTERVIEW_STATUS_LABEL: Record<InterviewStatus, string> = {
  [InterviewStatus.NeedsReview]: "Needs Review",
  [InterviewStatus.InProgress]: "In Progress",
  [InterviewStatus.Complete]: "Completed",
  [InterviewStatus.ConflictReported]: "Conflict",
};

export const INTERVIEW_GROUP_STATUS_LABEL: Record<InterviewGroupStatus, string> = {
  [InterviewGroupStatus.AvailabilityPending]: "Awaiting re-assignment",
  [InterviewGroupStatus.InvitesSent]: "Invites Sent",
  [InterviewGroupStatus.ReadyToInterview]: "Ready to interview",
};

export type StatusVariant = "gray" | "amber" | "green" | "blue";

export const REVIEW_STATUS_VARIANT: Record<ReviewStatus, StatusVariant> = {
  [ReviewStatus.Todo]: "gray",
  [ReviewStatus.InProgress]: "amber",
  [ReviewStatus.Done]: "green",
  [ReviewStatus.Conflict]: "amber",
};

export const INTERVIEW_STATUS_VARIANT: Record<InterviewStatus, StatusVariant> = {
  [InterviewStatus.NeedsReview]: "gray",
  [InterviewStatus.InProgress]: "amber",
  [InterviewStatus.Complete]: "green",
  [InterviewStatus.ConflictReported]: "amber",
};

export const INTERVIEW_GROUP_STATUS_VARIANT: Record<InterviewGroupStatus, StatusVariant> = {
  [InterviewGroupStatus.AvailabilityPending]: "amber",
  [InterviewGroupStatus.InvitesSent]: "blue",
  [InterviewGroupStatus.ReadyToInterview]: "green",
};

export const BADGE_CLASSES: Record<StatusVariant, string> = {
  gray: "border border-neutral-400 text-neutral-600 bg-neutral-50",
  amber: "border border-[#A45200] text-[#A45200] bg-[#FFFCF5]",
  green: "border border-green-400 text-green-700 bg-green-50",
  blue: "border border-blue-400 text-blue-700 bg-blue-50",
};
