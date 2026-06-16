import { DataTypes, Op } from "sequelize";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";

/**
 * Dataset for testing every review-dashboard sort parameter
 * (see ReviewCompositeService.getReviewDashboard / toReviewDashboardRowDTO).
 */

const SEED_EMAIL_PREFIX = "dashboard-sort-seed-applicant";
const REVIEWER_AUTH_PREFIX = "dashboard-sort-seed-reviewer";

const POSITION_TITLE = "Developer";

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

const ALICE = 9990001;
const BRIAN = 9990002;
const CLARA = 9990003;
const DEREK = 9990004;
const ERIN = 9990005;

const REVIEWERS = [
  { id: ALICE, firstName: "Alice" },
  { id: BRIAN, firstName: "Brian" },
  { id: CLARA, firstName: "Clara" },
  { id: DEREK, firstName: "Derek" },
  { id: ERIN, firstName: "Erin" },
];

type Reviewer = { id: number; score: number };

type Entry = {
  rowId: string;
  firstName: string;
  lastName: string;
  timesApplied: number;
  choice: number;
  status: string;
  /**
   * Reviewers for this record; [] = unreviewed (combined_review_score is null).
   * Each `score` is a per-reviewer rubric total (4-20). Reviewers are inserted in
   * array order; the inner query sorts by createdAt ASC, so reviewers[0] is the
   * REVIEWER_1 sort key and reviewers[1] is the REVIEWER_2 sort key.
   * combined_review_score is the sum of all reviewer scores.
   */
  reviewers: Reviewer[];
};

/** One dashboard row per entry, varied across every sort axis. */
const ENTRIES: Entry[] = [
  {
    rowId: "R01",
    firstName: "Yara",
    lastName: "Bennett",
    timesApplied: 1,
    choice: 1,
    status: "REVIEWED",
    reviewers: [{ id: BRIAN, score: 17 }],
  },
  {
    rowId: "R02",
    firstName: "Mona",
    lastName: "Yates",
    timesApplied: 4,
    choice: 2,
    status: "IN_REVIEW",
    reviewers: [{ id: CLARA, score: 12 }],
  },
  {
    rowId: "R03",
    firstName: "Felix",
    lastName: "Dawson",
    timesApplied: 2,
    choice: 1,
    status: "SELECTED",
    reviewers: [{ id: ALICE, score: 19 }],
  },
  {
    rowId: "R04",
    firstName: "Priya",
    lastName: "Adler",
    timesApplied: 3,
    choice: 2,
    status: "INTERVIEWED",
    reviewers: [{ id: DEREK, score: 8 }],
  },
  {
    rowId: "R05",
    firstName: "Quentin",
    lastName: "Larsson",
    timesApplied: 1,
    choice: 1,
    status: "OFFERED",
    reviewers: [{ id: ERIN, score: 20 }],
  },
  {
    rowId: "R06",
    firstName: "Bianca",
    lastName: "Rivera",
    timesApplied: 4,
    choice: 2,
    status: "REJECTED",
    reviewers: [{ id: BRIAN, score: 4 }],
  },
  // R07: no reviewer + null score (unreviewed applicant) — edge case.
  {
    rowId: "R07",
    firstName: "Nikhil",
    lastName: "Fontaine",
    timesApplied: 2,
    choice: 1,
    status: "APPLIED",
    reviewers: [],
  },
  {
    rowId: "R08",
    firstName: "Wesley",
    lastName: "Castellano",
    timesApplied: 3,
    choice: 2,
    status: "REVIEWED",
    reviewers: [{ id: CLARA, score: 15 }],
  },
  {
    rowId: "R09",
    firstName: "Diego",
    lastName: "Mwangi",
    timesApplied: 1,
    choice: 1,
    status: "IN_REVIEW",
    reviewers: [{ id: ALICE, score: 10 }],
  },
  // R10: two reviewers — array order = assignment order, so reviewer 1 = Alice,
  // reviewer 2 = Clara. Exercises REVIEWER_2 sort and a 2-reviewer combined
  // score (15 + 15 = 30, the dataset max).
  {
    rowId: "R10",
    firstName: "Talia",
    lastName: "Okafor",
    timesApplied: 4,
    choice: 2,
    status: "SELECTED",
    reviewers: [
      { id: ALICE, score: 15 },
      { id: CLARA, score: 15 },
    ],
  },
  {
    rowId: "R11",
    firstName: "Helena",
    lastName: "Underwood",
    timesApplied: 2,
    choice: 1,
    status: "INTERVIEWED",
    reviewers: [{ id: DEREK, score: 6 }],
  },
  {
    rowId: "R12",
    firstName: "Carlos",
    lastName: "Petrov",
    timesApplied: 3,
    choice: 2,
    status: "OFFERED",
    reviewers: [{ id: ERIN, score: 13 }],
  },
];

/**
 * Split a per-reviewer total (4-20) into four rubric fields each in [1,5], so the
 * stored review is consistent with how the app derives a reviewer's score
 * (passionFSG + teamPlayer + desireToLearn + skill).
 */
const reviewFromScore = (score: number) => {
  const base = Math.floor(score / 4);
  const remainder = score - base * 4;
  const fields = [0, 1, 2, 3].map((i) => base + (i < remainder ? 1 : 0));
  const [passionFSG, teamPlayer, desireToLearn, skill] = fields;
  return { passionFSG, teamPlayer, desireToLearn, skill };
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
    return {
      entry,
      applicant: {
        ...applicant,
        first_name: entry.firstName,
        last_name: entry.lastName,
        times_applied: entry.timesApplied,
        submitted_at: now,
        createdAt: now,
        updatedAt: now,
      },
      applicantRecord: {
        ...firstChoiceApplicantRecord,
        position: POSITION_TITLE,
        choice: entry.choice,
        status: entry.status,
        // Sum of reviewer scores; null when unreviewed (mirrors the app's derivation).
        combined_review_score: entry.reviewers.length
          ? entry.reviewers.reduce((sum, r) => sum + r.score, 0)
          : null,
        createdAt: now,
        updatedAt: now,
      },
      reviewedApplicantRecords: entry.reviewers.map((reviewer, idx) => ({
        applicant_record_id: firstChoiceApplicantRecord.id,
        reviewer_id: reviewer.id,
        review: JSON.stringify(reviewFromScore(reviewer.score)),
        score: reviewer.score,
        status: "DONE",
        // Stagger by index so the inner ORDER BY (createdAt ASC) pins
        // reviewer 1 = array[0], reviewer 2 = array[1].
        createdAt: new Date(now.getTime() + idx),
        updatedAt: now,
      })),
    };
  });

  const reviewerUsers = REVIEWERS.map((reviewer) => ({
    id: reviewer.id,
    first_name: reviewer.firstName,
    last_name: "Reviewer",
    auth_id: `${REVIEWER_AUTH_PREFIX}-${reviewer.id}@example.com`,
    role: "User",
    email: `${REVIEWER_AUTH_PREFIX}-${reviewer.id}@example.com`,
    createdAt: now,
    updatedAt: now,
  }));

  const t = await sequelize.transaction();
  try {
    await sequelize
      .getQueryInterface()
      .bulkInsert("users", reviewerUsers, { transaction: t });

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
      "reviewed_applicant_records",
      rows.flatMap((r) => r.reviewedApplicantRecords),
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
        "users",
        { auth_id: { [Op.like]: `${REVIEWER_AUTH_PREFIX}%` } },
        { transaction: t },
      );
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
