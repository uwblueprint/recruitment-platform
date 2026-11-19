import type { Migration } from "../umzug";

const TABLE_NAME = "user_term_records";
const PRIMARY_KEY_NAME = "user_term_records_pkey";

export const up: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  await sequelize.transaction(async (transaction) => {
    await queryInterface.removeConstraint(TABLE_NAME, PRIMARY_KEY_NAME, {
      transaction,
    });
    await queryInterface.addConstraint(TABLE_NAME, {
      fields: ["user_id", "term"],
      type: "primary key",
      name: PRIMARY_KEY_NAME,
      transaction,
    });
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  await sequelize.transaction(async (transaction) => {
    await queryInterface.removeConstraint(TABLE_NAME, PRIMARY_KEY_NAME, {
      transaction,
    });
    await queryInterface.addConstraint(TABLE_NAME, {
      fields: ["user_id"],
      type: "primary key",
      name: PRIMARY_KEY_NAME,
      transaction,
    });
  });
};
