import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("team_members", [
    {
      id: v4(),
      first_name: "Maggie",
      last_name: "Chen",
      team_role: "PL",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: v4(),
      first_name: "Percy",
      last_name: "Jackson",
      team_role: "DEVELOPER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("team_members", {
    first_name: ["Maggie", "Percy"],
    last_name: ["Chen", "Jackson"],
    team_role: ["PL", "DEVELOPER"],
  });
};
