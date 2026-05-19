import { DataTypes, Op } from "sequelize";
import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";
import { InterviewStatusEnum } from "../types/interviewedApplicantRecord";

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
};

const SEED_EMAIL_PREFIX = "real-data-test-interviewed-applicant";

const REVIEWER_USER_IDS = [9999999, 10000000, 10000001, 10000002] as const;

const INTERVIEW_STATUSES = [
  InterviewStatusEnum.NEEDS_REVIEW,
  InterviewStatusEnum.IN_PROGRESS,
  InterviewStatusEnum.COMPLETE,
] as const;

type ReviewDTO = {
  passionFSG: number;
  teamPlayer: number;
  desireToLearn: number;
  skill: number;
  skillCategory: string;
  comments: string;
};

type InterviewDTO = {
  passionFSG: number;
  teamPlayer: number;
  desireToLearn: number;
  skill: number;
  skillCategory: string;
  comments: string;
};

const getReviewDTO = (): ReviewDTO => {
  return {
    passionFSG: Math.floor(Math.random() * 5) + 1,
    teamPlayer: Math.floor(Math.random() * 5) + 1,
    desireToLearn: Math.floor(Math.random() * 5) + 1,
    skill: Math.floor(Math.random() * 5) + 1,
    skillCategory: ["JUNIOR", "INTERMEDIATE", "SENIOR"][
      Math.floor(Math.random() * 3)
    ],
    comments: [
      "Great applicant!",
      "Good applicant!",
      "Average applicant!",
      "Bad applicant!",
    ][Math.floor(Math.random() * 4)],
  };
};

const getInterviewDTO = (): InterviewDTO => {
  return {
    passionFSG: Math.floor(Math.random() * 5) + 1,
    teamPlayer: Math.floor(Math.random() * 5) + 1,
    desireToLearn: Math.floor(Math.random() * 5) + 1,
    skill: Math.floor(Math.random() * 5) + 1,
    skillCategory: ["JUNIOR", "INTERMEDIATE", "SENIOR"][
      Math.floor(Math.random() * 3)
    ],
    comments: [
      "Strong interview performance.",
      "Solid candidate with room to grow.",
      "Met expectations in the interview.",
      "Needs more depth in technical answers.",
    ][Math.floor(Math.random() * 4)],
  };
};

export const up: Seeder = async ({ context: sequelize }) => {
  const seedData = generateApplicantSeedBundles(SEED_EMAIL_PREFIX, 5);

  const applicants = seedData.map((s) => s.applicant);
  const firstChoiceApplicantRecords = seedData.map(
    (s) => s.firstChoiceApplicantRecord,
  );
  const secondChoiceApplicantRecords = seedData.flatMap((s) =>
    s.secondChoiceApplicantRecord ? [s.secondChoiceApplicantRecord] : [],
  );

  const applicantRecordIds = [
    ...firstChoiceApplicantRecords.map((s) => s.id),
    ...secondChoiceApplicantRecords.map((s) => s.id),
  ];

  const reviewedApplicantRecords = applicantRecordIds.map((id) => {
    return {
      applicant_record_id: id,
      reviewer_id:
        REVIEWER_USER_IDS[Math.floor(Math.random() * REVIEWER_USER_IDS.length)],
      /** bulkInsert cannot bind plain objects for jsonb; PG accepts a JSON text literal. */
      review: JSON.stringify(getReviewDTO()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const interviewedApplicantRecords = applicantRecordIds.map((id, index) => {
    const status =
      INTERVIEW_STATUSES[index % INTERVIEW_STATUSES.length];
    const hasInterviewData = status !== InterviewStatusEnum.NEEDS_REVIEW;

    return {
      id: v4(),
      applicant_record_id: id,
      score: hasInterviewData ? Math.floor(Math.random() * 5) + 1 : null,
      interview_json: hasInterviewData
        ? JSON.stringify(getInterviewDTO())
        : null,
      status,
      interview_date:
        status === InterviewStatusEnum.COMPLETE ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const t = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().bulkInsert(
      "users",
      REVIEWER_USER_IDS.map((id, index) => ({
        id,
        first_name: `Interviewer ${index + 1}`,
        last_name: `Interviewer ${index + 1}`,
        auth_id: `${SEED_EMAIL_PREFIX}${index + 1}@example.com`,
        role: "User",
        email: `${SEED_EMAIL_PREFIX}${index + 1}@example.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      { transaction: t },
    );

    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicants",
        applicants,
        { transaction: t },
        APPLICANT_BULK_INSERT_FIELD_TYPES as never,
      );
    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicant_records",
        firstChoiceApplicantRecords,
        { transaction: t },
        APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES as never,
      );
    await sequelize
      .getQueryInterface()
      .bulkInsert(
        "applicant_records",
        secondChoiceApplicantRecords,
        { transaction: t },
        APPLICANT_RECORD_BULK_INSERT_FIELD_TYPES as never,
      );

    await sequelize
      .getQueryInterface()
      .bulkInsert("reviewed_applicant_records", reviewedApplicantRecords, {
        transaction: t,
      });

    await sequelize
      .getQueryInterface()
      .bulkInsert("interviewed_applicant_records", interviewedApplicantRecords, {
        transaction: t,
      });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const down: Seeder = async ({ context: sequelize }) => {
  const t = await sequelize.transaction();
  try {
    // Cascade deletes applicant_records, reviewed_applicant_records, and interviewed_applicant_records.
    await sequelize.getQueryInterface().bulkDelete(
      "applicants",
      {
        email: {
          [Op.like]: `${SEED_EMAIL_PREFIX}%`,
        },
      },
      { transaction: t },
    );
    await sequelize.getQueryInterface().bulkDelete(
      "users",
      {
        auth_id: {
          [Op.like]: `${SEED_EMAIL_PREFIX}%`,
        },
      },
      { transaction: t },
    );
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
