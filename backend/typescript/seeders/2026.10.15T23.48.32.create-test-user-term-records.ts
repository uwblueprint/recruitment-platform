import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

// user_id is the table's primary key, so each one must be unique.
const TEST_USER_TERM_RECORDS = [
  {
    user_id: 1,
    project: "Project 1",
    position_id: "Developer",
    term: "1B",
  },
  {
    user_id: 2,
    project: "Project 2",
    position_id: "Designer",
    term: "2B",
  },
  {
    user_id: 3,
    project: "Project 3",
    position_id: "Product Manager",
    term: "3A",
  },
  {
    user_id: 4,
    project: "Project 4",
    position_id: "Developer",
    term: "3A",
  },
  {
    user_id: 5,
    project: "Project 5",
    position_id: "Developer",
    term: "2A",
  },
  {
    user_id: 6,
    project: "Project 6",
    position_id: "Designer",
    term: "1B",
  },
  {
    user_id: 7,
    project: "Project 7",
    position_id: "Product Manager",
    term: "4A",
  },
  {
    user_id: 8,
    project: "Project 8",
    position_id: "Developer",
    term: "3B",
  },
  {
    user_id: 9,
    project: "Project 9",
    position_id: "VP Design",
    term: "1A",
  },
  {
    user_id: 10,
    project: "Project 10",
    position_id: "Developer",
    term: "2A",
  },
  {
    user_id: 11,
    project: "Project 11",
    position_id: "Designer",
    term: "2A",
  },
  {
    user_id: 12,
    project: "Project 12",
    position_id: "Product Manager",
    term: "3A",
  },
];

const PROJECT_NAMES = [
  ...new Set(TEST_USER_TERM_RECORDS.map((r) => r.project)),
];

export const up: Seeder = async ({ context: sequelize }) => {
  const projectIds = new Map(PROJECT_NAMES.map((name) => [name, v4()]));
  const now = new Date();

  const t = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().bulkInsert(
      "projects",
      PROJECT_NAMES.map((name) => ({
        id: projectIds.get(name),
        project_name: name,
        is_archived: false,
      })),
      { transaction: t },
    );

    await sequelize.getQueryInterface().bulkInsert(
      "user_term_records",
      TEST_USER_TERM_RECORDS.map(({ project, ...record }) => ({
        ...record,
        project_id: projectIds.get(project),
        createdAt: now,
        updatedAt: now,
      })),
      { transaction: t },
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const down: Seeder = async ({ context: sequelize }) => {
  const t = await sequelize.transaction();
  try {
    await sequelize
      .getQueryInterface()
      .bulkDelete(
        "user_term_records",
        { user_id: TEST_USER_TERM_RECORDS.map((r) => r.user_id) },
        { transaction: t },
      );

    await sequelize
      .getQueryInterface()
      .bulkDelete(
        "projects",
        { project_name: PROJECT_NAMES },
        { transaction: t },
      );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
