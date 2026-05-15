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

export type ApplicantRecordDTO = {
  id: string;
  applicantId: string;
  position: string;
  roleSpecificQuestions: ShortAnswerQuestion[];
  choice: number;
  status: ApplicationStatus;
  skillCategory?: SkillCategory;
  combinedReviewScore?: number | null;
  isApplicantFlagged: boolean;
};

export type CreateApplicantRecordDTO = Omit<
  ApplicantRecordDTO,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateApplicantRecordDTO = Partial<
  Pick<
    ApplicantRecordDTO,
    "status" | "skillCategory" | "combinedReviewScore" | "isApplicantFlagged"
  >
>;
export type BulkUpdateApplicantRecordDTO = UpdateApplicantRecordDTO &
  Pick<ApplicantRecordDTO, "id">;
