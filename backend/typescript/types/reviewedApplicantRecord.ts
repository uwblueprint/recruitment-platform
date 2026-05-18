import { ValueOf } from "../utilities/typingUtils";
import { SkillCategory } from "./applicantRecord";

export const ReviewStatusEnum = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  CONFLICT: "CONFLICT",
} as const;

export type ReviewStatus = ValueOf<typeof ReviewStatusEnum>;

export type Review = {
  passionFSG?: number;
  teamPlayer?: number;
  desireToLearn?: number;
  skill?: number;
  skillCategory?: SkillCategory;
  comments?: string;
};

export type ReviewedApplicantRecordDTO = {
  applicantRecordId: string;
  reviewerId: string;
  review?: Review;
  status: ReviewStatus;
  score?: number;
  reviewerHasConflict: boolean;
};

export type CreateReviewedApplicantRecordDTO = Pick<
  ReviewedApplicantRecordDTO,
  "applicantRecordId" | "reviewerId" | "status"
>;
export type UpdateReviewedApplicantRecordDTO = Partial<
  Pick<ReviewedApplicantRecordDTO, "review" | "status" | "reviewerHasConflict">
>;
