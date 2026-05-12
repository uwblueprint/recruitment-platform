import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "interview_delegations";
export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    interviewed_applicant_record_id: {
      type: DataType.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "interviewed_applicant_records",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    interviewer_id: {
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

    group_id: {
      type: DataType.UUID,
      allowNull: false,
      references: {
        model: "interview_groups",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    interview_has_conflict: {
      type: DataType.STRING,
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
