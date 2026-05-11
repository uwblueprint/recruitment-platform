import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "applicant_records";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    },
    applicant_id: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: "applicants",
        key: "id",
      },
    },
    position: {
      type: DataType.STRING,
      allowNull: false,
      references: {
        model: "positions",
        key: "title",
      },
    },
    role_specific_questions: {
      type: DataType.ARRAY(DataType.JSONB),
      allowNull: false,
    },
    choice: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataType.STRING,
      allowNull: false,
    },
    is_applicant_flagged: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    combined_review_score: {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    skill_category: {
      type: DataType.STRING,
      allowNull: false,
    },
    is_shortlistsed_for_interview: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_shortlisted_for_offer: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    extra_info: {
      type: DataType.JSONB,
      allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
