import {
  positionTitleForExportRole,
  TIMES_APPLIED_MAP,
} from "../constants/applicantIngestion";
import {
  ApplicationStatusEnum,
  FirebaseApplication,
  FirebaseShortAnswerQuestion,
} from "../types";

type StoredQuestion = { question: string; response?: string };

// Ids are assigned by the models on insert; records are linked to their
// applicant by the caller.
export type ParsedApplicant = {
  first_name: string;
  last_name: string;
  email: string;
  academic_or_coop: string;
  academic_year: string;
  heard_from: string;
  location_preference: string;
  program: string;
  pronouns: string;
  resume_url: string;
  times_applied: number;
  short_answer_questions: StoredQuestion[];
  term: string;
  submitted_at: Date;
};

export type ParsedApplicantRecord = {
  position: string;
  role_specific_questions: StoredQuestion[];
  choice: number;
  status: string;
};

export type ParsedApplication = {
  applicant: ParsedApplicant;
  applicantRecords: ParsedApplicantRecord[];
};

const toStoredQuestions = (
  questions: FirebaseShortAnswerQuestion[] | undefined,
): StoredQuestion[] =>
  (questions ?? []).map(({ question, response }) => ({
    question,
    response: Array.isArray(response) ? response.join(", ") : response,
  }));

const toApplicantRecord = (
  application: FirebaseApplication,
  exportRole: string,
  choice: number,
): ParsedApplicantRecord => {
  const roleQuestions = application.roleSpecificQuestions?.find(
    (r) => r.role === exportRole,
  );
  if (!roleQuestions) {
    throw new Error(
      `no role-specific questions found for role "${exportRole}"`,
    );
  }
  return {
    position: positionTitleForExportRole(exportRole),
    role_specific_questions: toStoredQuestions(roleQuestions.questions),
    choice,
    status: ApplicationStatusEnum.APPLIED,
  };
};

/**
 * Convert one raw Firebase application into an `applicants` row and one
 * `applicant_records` row per role applied for (first choice, plus second
 * choice when present).
 * @throws Error if the application is missing data the schema requires
 */
export const parseFirebaseApplication = (
  application: FirebaseApplication,
): ParsedApplication => {
  if (!application.email?.trim()) {
    throw new Error("application has no email");
  }
  if (!application.firstChoiceRole) {
    throw new Error("application has no first choice role");
  }

  const pronouns = application.pronouns || application.pronounsSpecified || "";

  const applicant: ParsedApplicant = {
    first_name: application.firstName,
    last_name: application.lastName,
    email: application.email.trim(),
    academic_or_coop: application.academicOrCoop,
    academic_year: application.academicYear?.trim(),
    heard_from: application.heardFrom,
    location_preference: application.locationPreference,
    program: application.program,
    pronouns,
    resume_url: application.resumeUrl,
    times_applied:
      TIMES_APPLIED_MAP[
        application.timesApplied as keyof typeof TIMES_APPLIED_MAP
      ] ?? 0,
    short_answer_questions: toStoredQuestions(application.shortAnswerQuestions),
    term: application.term,
    submitted_at: new Date(application.timestamp),
  };

  const applicantRecords = [
    toApplicantRecord(application, application.firstChoiceRole, 1),
  ];
  if (application.secondChoiceRole) {
    applicantRecords.push(
      toApplicantRecord(application, application.secondChoiceRole, 2),
    );
  }

  return { applicant, applicantRecords };
};
