import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("team_members", [
    {
      id: v4(),
      first_name: "Tim",
      last_name: "Smith",
      team_role: "PM",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: v4(),
      first_name: "Ron",
      last_name: "Weasley",
      team_role: "DEVELOPER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("team_members", {
    first_name: ["Tim", "Ron"],
    last_name: ["Smith", "Weasley"],
    team_role: ["PM", "DEVELOPER"],
  });
};
