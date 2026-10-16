import { QueryTypes } from "sequelize";
import type { Seeder } from "../umzug-seed";
import { PROJECT_TEST_NAMES } from "./2026.10.09T00.53.22.create-test-projects";

// user_id is the table's primary key, so each one must be unique.
const TEST_USER_TERM_RECORDS = [
  {
    user_id: 1,
    project: PROJECT_TEST_NAMES[0],
    position_id: "Developer",
    term: "1B",
  },
  {
    user_id: 2,
    project: PROJECT_TEST_NAMES[0],
    position_id: "Designer",
    term: "2B",
  },
  {
    user_id: 3,
    project: PROJECT_TEST_NAMES[0],
    position_id: "Product Manager",
    term: "3A",
  },
  {
    user_id: 4,
    project: PROJECT_TEST_NAMES[1],
    position_id: "Developer",
    term: "3A",
  },
  {
    user_id: 5,
    project: PROJECT_TEST_NAMES[1],
    position_id: "Developer",
    term: "2A",
  },
  {
    user_id: 6,
    project: PROJECT_TEST_NAMES[1],
    position_id: "Designer",
    term: "1B",
  },
  {
    user_id: 7,
    project: PROJECT_TEST_NAMES[2],
    position_id: "Product Manager",
    term: "4A",
  },
  {
    user_id: 8,
    project: PROJECT_TEST_NAMES[2],
    position_id: "Developer",
    term: "3B",
  },
  {
    user_id: 9,
    project: PROJECT_TEST_NAMES[2],
    position_id: "VP Design",
    term: "1A",
  },
  {
    user_id: 10,
    project: PROJECT_TEST_NAMES[3],
    position_id: "Developer",
    term: "2A",
  },
  {
    user_id: 11,
    project: PROJECT_TEST_NAMES[3],
    position_id: "Designer",
    term: "2A",
  },
  {
    user_id: 12,
    project: PROJECT_TEST_NAMES[3],
    position_id: "Product Manager",
    term: "3A",
  },
];

export const up: Seeder = async ({ context: sequelize }) => {
  const projects = await sequelize.query<{ id: string; project_name: string }>(
    `SELECT id, project_name FROM projects WHERE project_name IN (:names)`,
    { replacements: { names: PROJECT_TEST_NAMES }, type: QueryTypes.SELECT },
  );
  const projectIds = new Map(projects.map((p) => [p.project_name, p.id]));

  const now = new Date();

  await sequelize.getQueryInterface().bulkInsert(
    "user_term_records",
    TEST_USER_TERM_RECORDS.map(({ project, ...record }) => {
      const projectId = projectIds.get(project);
      if (!projectId) {
        throw new Error(
          `Project "${project}" not found; run the projects seeder first.`,
        );
      }
      return {
        ...record,
        project_id: projectId,
        createdAt: now,
        updatedAt: now,
      };
    }),
  );
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("user_term_records", {
    user_id: TEST_USER_TERM_RECORDS.map((r) => r.user_id),
  });
};
