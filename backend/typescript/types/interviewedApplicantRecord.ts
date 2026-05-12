import { ValueOf } from "../utilities/typingUtils";
import { SkillCategory } from "./applicantRecord";

export const InterviewStatusEnum = {
  NEEDS_REVIEW: "NEEDS_REVIEW",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
} as const;

export type InterviewStatus = ValueOf<typeof InterviewStatusEnum>;

export type Interview = {
  passionFSG?: number;
  teamPlayer?: number;
  desireToLearn?: number;
  skill?: number;
  skillCategory?: SkillCategory;
  comments?: string;
};
