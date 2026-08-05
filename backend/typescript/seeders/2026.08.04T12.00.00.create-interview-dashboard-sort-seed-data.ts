import { DataTypes, Op } from "sequelize";
import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";
import { InterviewGroupStatusEnum } from "../types/interviewGroup";
import { InterviewStatusEnum } from "../types/interviewedApplicantRecord";

/**
 * Dataset for testing every interview-dashboard sort parameter
 * (see InterviewCompositeService.getInterviewDashboard /
 * toInterviewDashboardRowDTO). The review-dashboard equivalent is
 * 2026.06.02T12.00.00.create-dashboard-sort-seed-data.ts.
 *
 * Every applicant record here is INTERVIEWED or SELECTED, because those are the
 * only statuses the dashboard query returns.
 */

const SEED_EMAIL_PREFIX = "interview-dashboard-sort-seed-applicant";
const INTERVIEWER_AUTH_PREFIX = "interview-dashboard-sort-seed-interviewer";
const SEED_SCHEDULING_LINK_PREFIX = `${SEED_EMAIL_PREFIX}-scheduling-`;

const APPLICANT_BULK_INSERT_FIELD_TYPES = {
  short_answer_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
};

const APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES = {
  role_specific_questions: {
    type: new DataTypes.ARRAY(DataTypes.JSONB),
  },
};

const IVY = 9990101;
const JONAH = 9990102;
const KIRA = 9990103;
const LEO = 9990104;
const MAYA = 9990105;

/**
 * Distinct last names, because the interviewer sort orders by
 * `last_name || ' ' || first_name`. Ascending by that key the interviewers are:
 * Alvarez Kira, Brooks Jonah, Chen Maya, Nakamura Ivy, Whitfield Leo.
 */
const INTERVIEWERS = [
  { id: IVY, firstName: "Ivy", lastName: "Nakamura" },
  { id: JONAH, firstName: "Jonah", lastName: "Brooks" },
  { id: KIRA, firstName: "Kira", lastName: "Alvarez" },
  { id: LEO, firstName: "Leo", lastName: "Whitfield" },
  { id: MAYA, firstName: "Maya", lastName: "Chen" },
];

type Entry = {
  rowId: string;
  firstName: string;
  lastName: string;
  /** Must be an existing positions.title (FK target of applicant_records.position). */
  position: string;
  /** INTERVIEWED or SELECTED — the two statuses the dashboard query filters to. */
  status: string;
  /**
   * Interview rubric total (4-20), or null for an in-progress interview.
   * `hasInterviewRecord: false` means no interviewed_applicant_record row at all,
   * which the DTO also reports as a null score.
   */
  score: number | null;
  hasInterviewRecord: boolean;
  /**
   * Interviewers for this record. Inserted in array order with staggered
   * createdAt, so interviewers[0] is the INTERVIEWER_1 sort key and
   * interviewers[1] is the INTERVIEWER_2 sort key.
   */
  interviewers: number[];
};

/** One dashboard row per entry, varied across every sort axis. */
const ENTRIES: Entry[] = [
  {
    rowId: "I01",
    firstName: "Zaid",
    lastName: "Almeida",
    position: "Developer",
    status: "INTERVIEWED",
    score: 17,
    hasInterviewRecord: true,
    interviewers: [LEO, KIRA],
  },
  {
    rowId: "I02",
    firstName: "Wren",
    lastName: "Sandoval",
    position: "Designer",
    status: "SELECTED",
    score: 9,
    hasInterviewRecord: true,
    interviewers: [JONAH],
  },
  {
    rowId: "I03",
    firstName: "Oscar",
    lastName: "Delacroix",
    position: "Product Manager",
    status: "INTERVIEWED",
    score: 20,
    hasInterviewRecord: true,
    interviewers: [MAYA, IVY],
  },
  {
    rowId: "I04",
    firstName: "Ingrid",
    lastName: "Baptiste",
    position: "Developer",
    status: "SELECTED",
    score: 12,
    hasInterviewRecord: true,
    interviewers: [KIRA],
  },
  {
    rowId: "I05",
    firstName: "Theo",
    lastName: "Yamamoto",
    position: "VP Finance",
    status: "INTERVIEWED",
    score: 4,
    hasInterviewRecord: true,
    interviewers: [IVY, LEO],
  },
  {
    rowId: "I06",
    firstName: "Amara",
    lastName: "Novak",
    position: "Designer",
    status: "SELECTED",
    score: 15,
    hasInterviewRecord: true,
    interviewers: [LEO],
  },
  // I07: no interviewed_applicant_record at all — null score, zero interviewers.
  {
    rowId: "I07",
    firstName: "Dmitri",
    lastName: "Castellano",
    position: "Developer",
    status: "INTERVIEWED",
    score: null,
    hasInterviewRecord: false,
    interviewers: [],
  },
  {
    rowId: "I08",
    firstName: "Selma",
    lastName: "Iqbal",
    position: "Product Manager",
    status: "SELECTED",
    score: 7,
    hasInterviewRecord: true,
    interviewers: [JONAH, MAYA],
  },
  {
    rowId: "I09",
    firstName: "Boris",
    lastName: "Vance",
    position: "Developer",
    status: "INTERVIEWED",
    score: 19,
    hasInterviewRecord: true,
    interviewers: [KIRA, JONAH],
  },
  {
    rowId: "I10",
    firstName: "Priyanka",
    lastName: "Osei",
    position: "Designer",
    status: "SELECTED",
    score: 11,
    hasInterviewRecord: true,
    interviewers: [MAYA],
  },
  // I11: interview started but unscored — record exists, score is null.
  {
    rowId: "I11",
    firstName: "Camille",
    lastName: "Wu",
    position: "Developer",
    status: "INTERVIEWED",
    score: null,
    hasInterviewRecord: true,
    interviewers: [IVY],
  },
];

/**
 * Split an interview total (4-20) into four rubric fields each in [1,5], so the
 * stored interview_json is consistent with how the app derives the score
 * (passionFSG + teamPlayer + desireToLearn + skill).
 */
const interviewFromScore = (score: number) => {
  const base = Math.floor(score / 4);
  const remainder = score - base * 4;
  const fields = [0, 1, 2, 3].map((i) => base + (i < remainder ? 1 : 0));
  const [passionFSG, teamPlayer, desireToLearn, skill] = fields;
  return {
    passionFSG,
    teamPlayer,
    desireToLearn,
    skill,
    skillCategory: "INTERMEDIATE",
    comments: "Interview dashboard sort seed data.",
  };
};

export const up: Seeder = async ({ context: sequelize }) => {
  const now = new Date();

  // Base applicant/applicant_record bundles built from real export data via the
  // shared factory; we override only the fields each entry varies across sort axes.
  const bundles = generateApplicantSeedBundles(
    SEED_EMAIL_PREFIX,
    ENTRIES.length,
  );

  const rows = ENTRIES.map((entry, index) => {
    const { applicant, firstChoiceApplicantRecord } = bundles[index];
    const interviewedApplicantRecordId = v4();
    // One group per record keeps delegations independent; group_id is NOT NULL.
    const groupId = v4();

    return {
      entry,
      applicant: {
        ...applicant,
        first_name: entry.firstName,
        last_name: entry.lastName,
        submitted_at: now,
        createdAt: now,
        updatedAt: now,
      },
      applicantRecord: {
        ...firstChoiceApplicantRecord,
        position: entry.position,
        status: entry.status,
        createdAt: now,
        updatedAt: now,
      },
      interviewedApplicantRecord: entry.hasInterviewRecord
        ? {
            id: interviewedApplicantRecordId,
            applicant_record_id: firstChoiceApplicantRecord.id,
            score: entry.score,
            interview_json:
              entry.score === null
                ? null
                : JSON.stringify(interviewFromScore(entry.score)),
            status:
              entry.score === null
                ? InterviewStatusEnum.IN_PROGRESS
                : InterviewStatusEnum.COMPLETE,
            createdAt: now,
            updatedAt: now,
          }
        : null,
      interviewGroup: entry.interviewers.length
        ? {
            id: groupId,
            scheduling_link: `${SEED_SCHEDULING_LINK_PREFIX}${entry.rowId}`,
            status: InterviewGroupStatusEnum.READY_TO_INTERVIEW,
            createdAt: now,
            updatedAt: now,
          }
        : null,
      interviewDelegations: entry.interviewers.map((interviewerId, idx) => ({
        interviewed_applicant_record_id: interviewedApplicantRecordId,
        interviewer_id: interviewerId,
        group_id: groupId,
        // Stagger by index so the ORDER BY (createdAt ASC) pins
        // interviewer 1 = array[0], interviewer 2 = array[1].
        createdAt: new Date(now.getTime() + idx),
        updatedAt: now,
      })),
    };
  });

  const interviewerUsers = INTERVIEWERS.map((interviewer) => ({
    id: interviewer.id,
    first_name: interviewer.firstName,
    last_name: interviewer.lastName,
    auth_id: `${INTERVIEWER_AUTH_PREFIX}-${interviewer.id}@example.com`,
    role: "User",
    email: `${INTERVIEWER_AUTH_PREFIX}-${interviewer.id}@example.com`,
    createdAt: now,
    updatedAt: now,
  }));

  const t = await sequelize.transaction();
  try {
    await sequelize
      .getQueryInterface()
      .bulkInsert("users", interviewerUsers, { transaction: t });

    await sequelize.getQueryInterface().bulkInsert(
      "applicants",
      rows.map((r) => r.applicant),
      { transaction: t },
      APPLICANT_BULK_INSERT_FIELD_TYPES as never,
    );

    await sequelize.getQueryInterface().bulkInsert(
      "applicant_records",
      rows.map((r) => r.applicantRecord),
      { transaction: t },
      APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES as never,
    );

    await sequelize.getQueryInterface().bulkInsert(
      "interviewed_applicant_records",
      rows
        .map((r) => r.interviewedApplicantRecord)
        .filter((record): record is NonNullable<typeof record> => !!record),
      { transaction: t },
    );

    await sequelize.getQueryInterface().bulkInsert(
      "interview_groups",
      rows
        .map((r) => r.interviewGroup)
        .filter((group): group is NonNullable<typeof group> => !!group),
      { transaction: t },
    );

    await sequelize.getQueryInterface().bulkInsert(
      "interview_delegations",
      rows.flatMap((r) => r.interviewDelegations),
      { transaction: t },
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const down: Seeder = async ({ context: sequelize }) => {
  const t = await sequelize.transaction();
  try {
    // Cascade deletes applicant_records, interviewed records, and delegations.
    await sequelize
      .getQueryInterface()
      .bulkDelete(
        "applicants",
        { email: { [Op.like]: `${SEED_EMAIL_PREFIX}%` } },
        { transaction: t },
      );
    await sequelize
      .getQueryInterface()
      .bulkDelete(
        "interview_groups",
        { scheduling_link: { [Op.like]: `${SEED_SCHEDULING_LINK_PREFIX}%` } },
        { transaction: t },
      );
    await sequelize
      .getQueryInterface()
      .bulkDelete(
        "users",
        { auth_id: { [Op.like]: `${INTERVIEWER_AUTH_PREFIX}%` } },
        { transaction: t },
      );
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
