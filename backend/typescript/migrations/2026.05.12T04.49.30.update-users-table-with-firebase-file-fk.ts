import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "users";
export const up: Migration = async ({ context: sequelize }) => {
    await sequelize
    .getQueryInterface()
    .addColumn(TABLE_NAME, "profile_picture_file_id", {
      type: DataType.UUID,
      allowNull: true,
      references: {
        model: "firebase_files",
        key: "id",
      },
      defaultValue: null,
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize
    .getQueryInterface()
    .removeColumn(TABLE_NAME, "profile_picture_file_id");
};
