import { ValueOf } from "../utilities/typingUtils";

export type ApplicantRecordExtraInfo = {
  adminReview?: string;
};

export const ApplicationStatusEnum = {
  APPLIED: "APPLIED",
  IN_REVIEW: "IN_REVIEW",
  REVIEWED: "REVIEWED",
  SELECTED: "SELECTED",
  INTERVIEWED: "INTERVIEWED",
  OFFERED: "OFFERED",
  REJECTED: "REJECTED",
} as const;

export type ApplicationStatus = ValueOf<typeof ApplicationStatusEnum>;

export const SkillCategoryEnum = {
  JUNIOR: "JUNIOR",
  INTERMEDIATE: "INTERMEDIATE",
  SENIOR: "SENIOR",
} as const;

export type SkillCategory = ValueOf<typeof SkillCategoryEnum>;

export type ShortAnswerQuestion = {
  question: string;
  answer: string;
};
