import { DataTypes, Op } from "sequelize";
import type { Seeder } from "../umzug-seed";
import { generateApplicantSeedBundles } from "./factories/applicantSeedBundleFactory";

/** Prefix for seeded applicant emails; must match `down` filter and factory `emailPrefix`. */
const SEED_EMAIL_PREFIX = "real-data-test-applicant";

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

export const up: Seeder = async ({ context: sequelize }) => {
  const seedData = generateApplicantSeedBundles(SEED_EMAIL_PREFIX);

  const applicants = seedData.map((s) => s.applicant);
  const firstChoiceApplicantRecords = seedData.map(
    (s) => s.firstChoiceApplicantRecord,
  );
  const secondChoiceApplicantRecords = seedData.flatMap((s) =>
    s.secondChoiceApplicantRecord ? [s.secondChoiceApplicantRecord] : [],
  );

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
          [Op.like]: `${SEED_EMAIL_PREFIX}%`,
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
