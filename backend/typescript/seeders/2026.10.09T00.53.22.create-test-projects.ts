import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("projects", [
    {
      id: v4(),
      project_name: "Internal Tools",
      is_archived: false,
    },
    {
      id: v4(),
      project_name: "Forward Deployed",
      is_archived: false,
    },
    {
      id: v4(),
      project_name: "Feeding Canadian Kids",
      is_archived: true,
    },
    {
      id: v4(),
      project_name: "Home Again Furniture",
      is_archived: false,
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("projects", {
    project_name: [
      "Internal Tools",
      "Forward Deployed",
      "Feeding Canadian Kids",
      "Home Again Furniture",
    ],
  });
};
