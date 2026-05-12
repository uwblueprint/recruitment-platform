import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "reviewed_applicant_records";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    applicant_record_id: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: "applicant_records",
        key: "id",
      },
      primaryKey: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    reviewer_id: {
      type: DataType.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      primaryKey: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    review: {
      type: DataType.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: "TODO",
    },
    reviewer_has_conflict: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    score: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
