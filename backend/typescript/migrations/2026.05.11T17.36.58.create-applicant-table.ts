import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "applicants";
export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
    },
    academic_or_coop: {
      type: DataType.ENUM("Academic", "Co-op"),
      allowNull: false,
    },
    academic_year: {
      type: DataType.STRING,
      allowNull: false,
    },
    heard_from: {
      type: DataType.STRING,
      allowNull: false,
    },
    location_preference: {
      type: DataType.STRING,
      allowNull: false,
    },
    program: {
      type: DataType.STRING,
      allowNull: false,
    },
    pronouns: {
      type: DataType.STRING,
      allowNull: false,
    },
    resume_url: {
      type: DataType.STRING,
      allowNull: false,
    },
    times_applied: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    short_answer_questions: {
      type: DataType.ARRAY(DataType.JSONB),
      allowNull: false,
    },
    term: {
      type: DataType.STRING,
      allowNull: false,
    },
    submitted_at: {
      type: DataType.DATE,
      allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
