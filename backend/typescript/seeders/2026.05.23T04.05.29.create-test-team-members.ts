import { v4 as uuidv4 } from "uuid";

import type { Seeder } from "../umzug-seed";

const id1 = uuidv4();
const id2 = uuidv4();

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("team_members", [
    {
      id: id1,
      first_name: "orange",
      last_name: "juice",
      team_role: "DEVELOPER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: id2,
      first_name: "apple",
      last_name: "pop",
      team_role: "PL",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("team_members", {
    first_name: ["orange", "apple"],
    last_name: ["juice", "pop"],
    team_role: ["DEVELOPER", "PL"],
  });
};
