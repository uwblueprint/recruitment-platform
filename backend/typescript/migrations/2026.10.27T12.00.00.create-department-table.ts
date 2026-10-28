import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "departments";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    slug: {
      type: DataType.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    is_archived: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });

  // Nullable so a position added without a department still shows up in the
  // all-roles view instead of failing to insert.
  await sequelize.getQueryInterface().addColumn("positions", "department", {
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
    references: { model: TABLE_NAME, key: "slug" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn("positions", "department");
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
