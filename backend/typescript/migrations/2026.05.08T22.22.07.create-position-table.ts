import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

const TABLE_NAME = "positions";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    title: {
      type: DataType.STRING,
      allowNull: false,
      primaryKey: true,
    },
    is_archived: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
