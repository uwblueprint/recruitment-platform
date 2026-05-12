import * as fs from "fs";
import * as path from "path";

import { v4 } from "uuid";

const TIMES_APPLIED_MAP = {
  "This is my first time!": 1,
  Once: 2,
  Twice: 3,
  "3 or more": 4,
} as const;

/** Export labels in applications.json - `positions.title` from create-bp-positions seeder (FK target). */
const POSITION_TITLE_BY_EXPORT_ROLE: Record<string, string> = {
  "Product Designer": "Designer",
  "Project Developer": "Developer",
  "VP Finance & Operations": "VP Finance",
  "VP Project Scoping": "VP Scoping",
};

function positionTitleForApplicantRecord(exportRoleTitle: string): string {
  return POSITION_TITLE_BY_EXPORT_ROLE[exportRoleTitle] ?? exportRoleTitle;
}

export type ShortAnswerQuestion = {
  question: string;
  response?: string;
};

export type JSONRoleSpecificQuestion = {
  id: string;
  role: string;
  questions: ShortAnswerQuestion[];
};

export type JSONApplication = {
  academicOrCoop: string;
  academicYear: string;
  email: string;
  firstChoiceRole: string;
  firstName: string;
  heardFrom: string;
  lastName: string;
  locationPreference: string;
  program: string;
  pronouns: string;
  resumeUrl: string;
  roleSpecificQuestions: JSONRoleSpecificQuestion[];
  secondChoiceRole?: string;
  shortAnswerQuestions: ShortAnswerQuestion[];
  term: string;
  timesApplied: string;
  timestamp: number;
};

export type CreateApplicantDTO = {
  id: string;
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
  short_answer_questions: ShortAnswerQuestion[];
  term: string;
  submitted_at: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateApplicantRecordDTO = {
  id: string;
  applicant_id: string;
  position: string;
  role_specific_questions: ShortAnswerQuestion[];
  choice: number;
  status: string;
};

/** One source application - one applicant row plus first (and optional second) applicant_record rows. */
export type ApplicantSeedBundle = {
  applicant: CreateApplicantDTO;
  firstChoiceApplicantRecord: CreateApplicantRecordDTO;
  secondChoiceApplicantRecord?: CreateApplicantRecordDTO;
};

const getRoleSpecificQuestions = (
  data: JSONRoleSpecificQuestion[],
  roleTitle: string,
): ShortAnswerQuestion[] => {
  const roleQuestions = data.find((d) => d.role === roleTitle);
  if (!roleQuestions) {
    throw new Error(`Role ${roleTitle} not found in data`);
  }
  const questions = roleQuestions.questions ?? [];
  return questions.map((q) => {
    if (!q.question) {
      throw new Error(`Question text is required for role ${roleTitle}`);
    }
    return {
      question: q.question,
      response: Array.isArray(q.response)
        ? q.response.join(", ")
        : q.response ?? undefined,
    };
  });
};

export function loadApplications(
  applicationsJsonPath = path.join(
    __dirname,
    "..",
    "data",
    "applications.json",
  ),
): JSONApplication[] {
  const raw = fs.readFileSync(applicationsJsonPath, "utf8");
  return JSON.parse(raw) as JSONApplication[];
}

const getApplicantDTO = (
  app: JSONApplication,
  applicantId: string,
  emailPrefix: string,
): CreateApplicantDTO => {
  return {
    id: applicantId,
    first_name: app.firstName,
    last_name: app.lastName,
    email: `${emailPrefix}-${app.email}`,
    academic_or_coop: app.academicOrCoop,
    academic_year: app.academicYear,
    heard_from: app.heardFrom,
    location_preference: app.locationPreference,
    program: app.program,
    pronouns: app.pronouns,
    resume_url: app.resumeUrl,
    times_applied:
      TIMES_APPLIED_MAP[app.timesApplied as keyof typeof TIMES_APPLIED_MAP] ??
      0,
    short_answer_questions: app.shortAnswerQuestions.map((q) => ({
      question: q.question,
      response: q.response,
    })),
    term: app.term,
    submitted_at: new Date(app.timestamp),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const getApplicantRecordDTO = (
  app: JSONApplication,
  applicantId: string,
  choiceRoleFromExport: string,
  choice: number,
): CreateApplicantRecordDTO => {
  const position = positionTitleForApplicantRecord(choiceRoleFromExport);
  return {
    id: v4(),
    applicant_id: applicantId,
    position,
    role_specific_questions: getRoleSpecificQuestions(
      app.roleSpecificQuestions,
      choiceRoleFromExport,
    ),
    choice,
    status: "APPLIED",
  };
};

export function generateApplicantSeedBundles(
  identifyingEmailPrefix: string,
  /** First N applications from JSON. Omit to use the full file. */
  applicationCount?: number,
  dataJsonPath?: string,
): ApplicantSeedBundle[] {
  const apps = loadApplications(dataJsonPath);
  const capped = applicationCount
    ? apps.slice(0, Math.min(applicationCount, apps.length))
    : apps;

  return capped.map((app) => {
    const applicantId = v4();
    return {
      applicant: getApplicantDTO(app, applicantId, identifyingEmailPrefix),
      firstChoiceApplicantRecord: getApplicantRecordDTO(
        app,
        applicantId,
        app.firstChoiceRole,
        1,
      ),
      secondChoiceApplicantRecord: app.secondChoiceRole
        ? getApplicantRecordDTO(app, applicantId, app.secondChoiceRole, 2)
        : undefined,
    };
  });
}
