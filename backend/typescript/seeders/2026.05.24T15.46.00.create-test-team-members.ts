import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("team_members", [
    {
      id: v4(),
      first_name: "Darren",
      last_name: "Watkins",
      team_role: "DEVELOPER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: v4(),
      first_name: "Aubrey",
      last_name: "Graham",
      team_role: "PL",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("team_members", {
    first_name: ["Darren", "Aubrey"],
    last_name: ["Watkins", "Graham"],
    team_role: ["DEVELOPER", "PL"],
  });
};
