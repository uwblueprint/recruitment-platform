import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

const TABLE_NAME = "users";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn(TABLE_NAME, "position", {
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
    references: {
      model: "positions",
      key: "title",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  await sequelize.getQueryInterface().addColumn(TABLE_NAME, "is_archived", {
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn(TABLE_NAME, "is_archived");
  await sequelize.getQueryInterface().removeColumn(TABLE_NAME, "position");
};
