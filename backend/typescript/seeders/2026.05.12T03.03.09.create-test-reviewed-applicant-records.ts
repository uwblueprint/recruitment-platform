import { DataTypes, Op } from "sequelize";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";

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

const SEED_EMAIL_PREFIX = "real-data-test-reviewed-applicant";

type ReviewDTO = {
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

  const t = await sequelize.transaction();
  try {
    // bulk insert the reviewer users
    await sequelize.getQueryInterface().bulkInsert(
      "users",
      [
        {
          id: 5,
          first_name: "Reviewer 1",
          last_name: "Reviewer 1",
          auth_id: `${SEED_EMAIL_PREFIX}1@example.com`,
          role: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          first_name: "Reviewer 2",
          last_name: "Reviewer 2",
          auth_id: `${SEED_EMAIL_PREFIX}2@example.com`,
          role: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          first_name: "Reviewer 3",
          last_name: "Reviewer 3",
          auth_id: `${SEED_EMAIL_PREFIX}3@example.com`,
          role: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          first_name: "Reviewer 4",
          last_name: "Reviewer 4",
          auth_id: `${SEED_EMAIL_PREFIX}4@example.com`,
          role: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { transaction: t },
    );

    // bulk insert the applicant and applicant_record seed bundle data
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

    const reviewedApplicantRecords = applicantRecordIds.map((id) => {
      return {
        applicant_record_id: id,
        reviewer_id: [5, 6, 7, 8][Math.floor(Math.random() * 4)], // 5-8 are the reviewer user ids
        /** bulkInsert cannot bind plain objects for jsonb; PG accepts a JSON text literal. */
        review: JSON.stringify(getReviewDTO()),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await sequelize
      .getQueryInterface()
      .bulkInsert("reviewed_applicant_records", reviewedApplicantRecords, {
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
    // this cascade deletes the applicant_records and reviewed_applicant_records
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
