import { Op } from "sequelize";
import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";
import {
  APPLICANT_BULK_INSERT_FIELD_TYPES,
  APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES,
  interviewFromScore,
} from "./factories/dashboardSeedHelpers";
import {
  ApplicationStatusEnum,
  SkillCategory,
  SkillCategoryEnum,
} from "../types/applicantRecord";
import { InterviewConflictEnum } from "../types/interviewDelegation";
import { InterviewGroupStatusEnum } from "../types/interviewGroup";
import { InterviewStatusEnum } from "../types/interviewedApplicantRecord";

/**
 * Dataset for testing interview-dashboard search, filters, and tabs
 * (see InterviewCompositeService.getInterviewDashboard and
 * utilities/dashboardFilterUtils). The sort-focused equivalent is
 * 2026.08.04T12.00.00.create-interview-dashboard-sort-seed-data.ts.
 *
 * Every attribute is picked by row index against a cycle length coprime with
 * the others, so the data is deterministic but filter combinations still vary
 * (e.g. bookmarked rows span every role and skill category). Enough rows for
 * three pages at the default 25 per page.
 *
 * Every applicant record here is INTERVIEWED or SELECTED, because those are the
 * only statuses the dashboard query returns.
 */

const SEED_EMAIL_PREFIX = "interview-dashboard-filter-seed-applicant";
const INTERVIEWER_AUTH_PREFIX = "interview-dashboard-filter-seed-interviewer";
const SEED_SCHEDULING_LINK_PREFIX = `${SEED_EMAIL_PREFIX}-scheduling-`;

const ROW_COUNT = 60;

const INTERVIEWERS = [
  { id: 9980101, firstName: "Rosa", lastName: "Lindqvist" },
  { id: 9980102, firstName: "Omar", lastName: "Haddad" },
  { id: 9980103, firstName: "Grace", lastName: "Kimura" },
  { id: 9980104, firstName: "Nate", lastName: "Ferreira" },
  { id: 9980105, firstName: "Lena", lastName: "Mbeki" },
  { id: 9980106, firstName: "Arjun", lastName: "Patel" },
];

/**
 * Ann / Anna / Hannah / Joanne overlap on purpose so partial-name search
 * ("ann") matches several rows. 20 first names x 15 last names paired by
 * (i % 20, 7i % 15) gives 60 distinct full names, with last names shared.
 */
const FIRST_NAMES = [
  "Ann",
  "Anna",
  "Hannah",
  "Joanne",
  "Marcus",
  "Elif",
  "Tobias",
  "Nadia",
  "Kofi",
  "Sofia",
  "Ravi",
  "Chloe",
  "Mateo",
  "Yuki",
  "Bianca",
  "Henrik",
  "Leila",
  "Dev",
  "Ines",
  "Callum",
];
const LAST_NAMES = [
  "Morgan",
  "Okonkwo",
  "Larsen",
  "Tanaka",
  "Rossi",
  "Ahmed",
  "Fischer",
  "Dubois",
  "Kowalski",
  "Mendes",
  "Singh",
  "OBrien",
  "Haas",
  "Nguyen",
  "Varga",
];

/** Must be existing positions.title values (FK target of applicant_records.position). */
const POSITIONS = [
  "Developer",
  "Designer",
  "Product Manager",
  "Project Lead",
  "VP Finance",
];

const SKILL_CATEGORIES = [
  SkillCategoryEnum.JUNIOR,
  SkillCategoryEnum.INTERMEDIATE,
  SkillCategoryEnum.SENIOR,
  null,
];

/** Matches the Year filter options in getReviewDashboardFilterOptions. */
const YEARS = [
  "1A",
  "1B",
  "2A",
  "2B",
  "3A",
  "3B",
  "4A",
  "4B",
  "5A",
  "5B",
  "Graduate student",
];

const CONFLICTS = Object.values(InterviewConflictEnum);

const cycle = <T>(values: readonly T[], index: number): T =>
  values[index % values.length];

type Entry = {
  firstName: string;
  lastName: string;
  position: string;
  status: string;
  skillCategory: SkillCategory | null;
  academicYear: string;
  bookmarked: boolean;
  shortlistedForOffer: boolean;
  /** Set on interviewer 1's delegation; surfaces the row in the Conflicts tab. */
  conflict: string | null;
  /** Interview rubric total (4-20), or null for an unscored interview. */
  score: number | null;
  /** false means no interviewed_applicant_record row and no interviewers. */
  hasInterviewRecord: boolean;
  interviewerIds: number[];
};

const buildEntry = (i: number): Entry => {
  const hasInterviewRecord = i % 20 !== 19;
  const conflict =
    hasInterviewRecord && (i % 17 === 3 || i % 17 === 11)
      ? cycle(CONFLICTS, i)
      : null;
  const unscored = !hasInterviewRecord || !!conflict || i % 20 === 9;

  let interviewerIds: number[] = [];
  if (hasInterviewRecord) {
    // Mostly pairs, with an occasional solo interviewer.
    interviewerIds =
      i % 11 === 5
        ? [cycle(INTERVIEWERS, i).id]
        : [cycle(INTERVIEWERS, i).id, cycle(INTERVIEWERS, i + 2).id];
  }

  return {
    firstName: cycle(FIRST_NAMES, i),
    lastName: cycle(LAST_NAMES, i * 7),
    position: cycle(POSITIONS, i),
    status:
      i % 3 === 0
        ? ApplicationStatusEnum.SELECTED
        : ApplicationStatusEnum.INTERVIEWED,
    skillCategory: cycle(SKILL_CATEGORIES, i),
    academicYear: cycle(YEARS, i),
    bookmarked: i % 7 === 0 || i % 7 === 3,
    shortlistedForOffer: [1, 5, 9].includes(i % 13),
    conflict,
    score: unscored ? null : ((i * 7) % 17) + 4,
    hasInterviewRecord,
    interviewerIds,
  };
};

const interviewStatusFor = (entry: Entry) => {
  if (entry.conflict) return InterviewStatusEnum.CONFLICT_REPORTED;
  if (entry.score === null) return InterviewStatusEnum.IN_PROGRESS;
  return InterviewStatusEnum.COMPLETE;
};

export const up: Seeder = async ({ context: sequelize }) => {
  const now = new Date();
  const entries = Array.from({ length: ROW_COUNT }, (_, i) => buildEntry(i));

  // Base applicant/applicant_record bundles built from real export data via the
  // shared factory; we override only the fields the filters and tabs read.
  const bundles = generateApplicantSeedBundles(SEED_EMAIL_PREFIX, ROW_COUNT);
  if (bundles.length < ROW_COUNT) {
    throw new Error(
      `Need ${ROW_COUNT} source applications in applications.json, found ${bundles.length}.`,
    );
  }

  const rows = entries.map((entry, index) => {
    const { applicant, firstChoiceApplicantRecord } = bundles[index];
    const interviewedApplicantRecordId = v4();
    // One group per record keeps delegations independent; group_id is NOT NULL.
    const groupId = v4();

    return {
      applicant: {
        ...applicant,
        first_name: entry.firstName,
        last_name: entry.lastName,
        academic_year: entry.academicYear,
        submitted_at: now,
        createdAt: now,
        updatedAt: now,
      },
      applicantRecord: {
        ...firstChoiceApplicantRecord,
        position: entry.position,
        status: entry.status,
        skill_category: entry.skillCategory,
        is_applicant_flagged: entry.bookmarked,
        is_shortlisted_for_offer: entry.shortlistedForOffer,
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
                : JSON.stringify(
                    interviewFromScore(
                      entry.score,
                      "Interview dashboard filter seed data.",
                      entry.skillCategory ?? undefined,
                    ),
                  ),
            status: interviewStatusFor(entry),
            createdAt: now,
            updatedAt: now,
          }
        : null,
      interviewGroup: entry.interviewerIds.length
        ? {
            id: groupId,
            scheduling_link: `${SEED_SCHEDULING_LINK_PREFIX}${index}`,
            status: InterviewGroupStatusEnum.READY_TO_INTERVIEW,
            createdAt: now,
            updatedAt: now,
          }
        : null,
      interviewDelegations: entry.interviewerIds.map((interviewerId, idx) => ({
        interviewed_applicant_record_id: interviewedApplicantRecordId,
        interviewer_id: interviewerId,
        group_id: groupId,
        interview_has_conflict: idx === 0 ? entry.conflict : null,
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
