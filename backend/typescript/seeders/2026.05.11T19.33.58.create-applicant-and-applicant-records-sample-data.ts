import * as fs from "fs";
import * as path from "path";

import { DataTypes, Op } from "sequelize";
import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

/** Tell Sequelize how to escape jsonb[] / jsonb columns when using queryInterface.bulkInsert.
 * (Runtime accepts this map; Sequelize 6.5 typings only list string|string[] for the 4th argument.)
 */
const APPLICANT_BULK_INSERT_FIELD_TYPES = {
  short_answer_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
};

const APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES = {
  role_specific_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
  extra_info: { type: DataTypes.JSONB },
};

const TIMES_APPLIED_MAP = {
  "This is my first time!": 1,
  Once: 2,
  Twice: 3,
  "3 or more": 4,
} as const;

const TEST_SLUG = "real-data-test-applicant";

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
  id: string;
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

const TEST_APPLICANT_ID_PREFIX = "real-data-test-applicant";

const getApplicantDTO = (
  app: JSONApplication,
  applicantId: string,
): CreateApplicantDTO => {
  return {
    id: applicantId,
    first_name: app.firstName,
    last_name: app.lastName,
    email: `${TEST_APPLICANT_ID_PREFIX}-${app.email}`,
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

function generateSeedData(applications: JSONApplication[]): SeedData[] {
  return applications.map((app) => {
    const applicantId = v4();
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((s) => s.secondChoiceApplicantRecord!);

  const t = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().bulkInsert("positions", [
      {
        title: "User Experience Researcher",
        is_archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await sequelize.getQueryInterface().bulkInsert(
      "applicants",
      seedApplicants,
      { transaction: t },
      // sequelize@6.5 .d.ts types arg 4 as string|string[]; runtime accepts field→attribute map (see lib query-interface.js).
      APPLICANT_BULK_INSERT_FIELD_TYPES as never,
    );
    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicant_records",
        seedFirstChoiceApplicantRecords,
        { transaction: t },
        APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES as never,
      );
    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicant_records",
        seedSecondChoiceApplicantRecords,
        { transaction: t },
        APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES as never,
      );
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

export const down: Seeder = async ({ context: sequelize }) => {
  const t = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().bulkDelete(
      "applicants",
      {
        email: {
          [Op.like]: `${TEST_SLUG}%`,
        },
      },
      { transaction: t },
    );
    await sequelize.getQueryInterface().bulkDelete(
      "positions",
      {
        title: "User Experience Researcher",
      },
      { transaction: t },
    );
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
