import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "user_term_records";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    user_id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    project_id: {
      type: DataType.UUID,
      allowNull: false,
    },

    position_id: {
      type: DataType.STRING,
      allowNull: false,
    },

    term: {
      type: DataType.STRING,
      allowNull: false,
    },

    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
