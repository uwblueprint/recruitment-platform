import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "interviewed_applicant_records";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    applicant_record_id: {
      type: DataType.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "applicant_records",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    score: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    interview_json: {
      type: DataType.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataType.STRING,
      allowNull: false,
      defaultValue: "NEEDS_REVIEW",
    },
    interview_notes_id: {
      type: DataType.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "firebase_files",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    scheduling_link: {
      type: DataType.STRING,
      allowNull: true,
      defaultValue: null,
    },
    interview_date: {
      type: DataType.DATE,
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
