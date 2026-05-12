import { DataType } from "sequelize-typescript";
import type { Migration } from "../umzug";

const TABLE_NAME = "firebase_files";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(TABLE_NAME, {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    storage_path: {
      type: DataType.STRING,
      allowNull: false,
    },
    original_file_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    uploaded_user_id: {
      type: DataType.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    size_bytes: {
      type: DataType.BIGINT,
      allowNull: false,
    },

    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
