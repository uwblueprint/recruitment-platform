import { ShortAnswerQuestion } from "./applicantRecord";

export type AcademicOrCoop = "Academic" | "Co-op";

export type ApplicantDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  academicOrCoop: AcademicOrCoop;
  academicYear: string;
  heardFrom: string;
  locationPreference: string;
  program: string;
  pronouns: string;
  resumeUrl: string;
  timesApplied: number;
  shortAnswerQuestions: ShortAnswerQuestion[];
  term: string;
  submittedAt: Date;
};
export type CreateApplicantDTO = Omit<ApplicantDTO, "id">;
export type UpdateApplicantDTO = Partial<Omit<ApplicantDTO, "id">>;
