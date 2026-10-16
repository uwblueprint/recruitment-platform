import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

export const PROJECT_TEST_NAMES = [
  "Internal Tools",
  "Forward Deployed",
  "Feeding Canadian Kids",
  "Home Again Furniture",
];

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("projects", [
    {
      id: v4(),
      project_name: PROJECT_TEST_NAMES[0],
      is_archived: false,
    },
    {
      id: v4(),
      project_name: PROJECT_TEST_NAMES[1],
      is_archived: false,
    },
    {
      id: v4(),
      project_name: PROJECT_TEST_NAMES[2],
      is_archived: true,
    },
    {
      id: v4(),
      project_name: PROJECT_TEST_NAMES[3],
      is_archived: false,
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("projects", {
    project_name: PROJECT_TEST_NAMES,
  });
};
