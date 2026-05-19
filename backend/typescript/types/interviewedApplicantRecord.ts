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

export type InterviewedApplicantRecordDTO = {
  id: string;
  applicantRecordId: string;
  score?: number;
  interviewJson?: Interview;
  status: InterviewStatus;
  interviewNotesId?: string;
  interviewDate?: Date;
};

export type CreateInterviewedApplicantRecordDTO = Pick<
  InterviewedApplicantRecordDTO,
  "applicantRecordId"
>;

export type UpdateInterviewedApplicantRecordDTO = Partial<
  Omit<InterviewedApplicantRecordDTO, "id" | "applicantRecordId">
>;
