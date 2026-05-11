import * as fs from "fs";
import * as path from "path";

import { Op } from "sequelize";
import type { Seeder } from "../umzug-seed";

const TIMES_APPLIED_MAP = {
  "This is my first time!": 1,
  Once: 2,
  Twice: 3,
  "3 or more": 4,
} as const;

const TEST_SLUG = "real-data-test-applicant";

type ShortAnswerQuestion = {
  question: string;
  response?: string;
};

type JSONRoleSpecificQuestion = {
  id: string;
  role: string;
  questions: ShortAnswerQuestion[];
};

type JSONApplication = {
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

type CreateApplicantDTO = {
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

type CreateApplicantRecordDTO = {
  applicant_id: string;
  position: string;
  role_specific_questions: ShortAnswerQuestion[];
  choice: number;
  status: string;
};

const getRoleSpecificQuestions = (
  data: JSONRoleSpecificQuestion[],
  roleTitle: string,
): ShortAnswerQuestion[] => {
  const roleQuestions = data.find((d) => d.role === roleTitle);
  if (!roleQuestions) {
    throw new Error(`Role ${roleTitle} not found in data`);
  }
  return roleQuestions.questions.map((q) => {
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

function loadApplications(): JSONApplication[] {
  const filePath = path.join(__dirname, "data", "applications.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as JSONApplication[];
}

type SeedData = {
  applicant: CreateApplicantDTO;
  firstChoiceApplicantRecord: CreateApplicantRecordDTO;
  secondChoiceApplicantRecord?: CreateApplicantRecordDTO;
};

const getApplicantDTO = (
  app: JSONApplication,
  applicantId: string,
): CreateApplicantDTO => {
  return {
    id: applicantId,
    first_name: app.firstName,
    last_name: app.lastName,
    email: app.email,
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
  position: string,
  choice: number,
): CreateApplicantRecordDTO => {
  return {
    applicant_id: applicantId,
    position,
    role_specific_questions: getRoleSpecificQuestions(
      app.roleSpecificQuestions,
      position,
    ),
    choice,
    status: "APPLIED",
  };
};

function generateSeedData(applications: JSONApplication[]): SeedData[] {
  return applications.map((app) => {
    const applicantId = `${TEST_SLUG}-${app.email}-${app.timestamp}`;
    return {
      applicant: getApplicantDTO(app, applicantId),
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

export const up: Seeder = async ({ context: sequelize }) => {
  const applications = loadApplications();

  const seedData = generateSeedData(applications);

  const seedApplicants = seedData.map((s) => s.applicant);
  const seedFirstChoiceApplicantRecords = seedData.map(
    (s) => s.firstChoiceApplicantRecord,
  );
  const seedSecondChoiceApplicantRecords = seedData
    .filter((s) => s.secondChoiceApplicantRecord)
    .map((s) => s.secondChoiceApplicantRecord!);

  const t = await sequelize.transaction();
  try {
    await sequelize
      .getQueryInterface()
      .bulkInsert("applicants", seedApplicants);
    await sequelize
      .getQueryInterface()
      .bulkInsert("applicant_records", seedFirstChoiceApplicantRecords);
    await sequelize
      .getQueryInterface()
      .bulkInsert("applicant_records", seedSecondChoiceApplicantRecords);
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

export const down: Seeder = async ({ context: sequelize }) => {
  const t = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().bulkDelete("applicants", {
      id: {
        [Op.like]: `${TEST_SLUG}%`,
      },
    });
    await sequelize.getQueryInterface().bulkDelete("applicant_records", {
      applicant_id: {
        [Op.like]: `${TEST_SLUG}%`,
      },
    });
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
