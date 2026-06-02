import { DataType } from "sequelize-typescript";
import { Migration } from "../umzug";

const TABLE_NAME = "team_members";

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
    team_role: {
      type: DataType.ENUM("PM", "DESIGNER", "PL", "DEVELOPER"),
      allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable(TABLE_NAME);
  await sequelize
    .getQueryInterface()
    .sequelize.query('DROP TYPE IF EXISTS "enum_team_members_team_role";');
};
