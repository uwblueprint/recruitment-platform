import { v4 } from "uuid";
import type { Seeder } from "../umzug-seed";

const USER_ID_OFFSET = 31000000;
const userId = (targetId: number) => USER_ID_OFFSET + targetId;

const SEED_EMAIL_PREFIX = "seed-term-record-user-";

// fixed projects
const PROJECT_NAMES = [
  "Project 1",
  "Project 2",
  "Project 3",
  "Project 4",
  "Project 5",
  "Project 6",
  "Project 7",
  "Project 8",
  "Project 9",
  "Project 10",
  "Project 11",
  "Project 12",
];

const TEST_USER_TERM_RECORDS = [
  { targetId: 1, projectIndex: 0, position_id: "Developer", term: "1B" },
  { targetId: 2, projectIndex: 1, position_id: "Designer", term: "2B" },
  { targetId: 3, projectIndex: 2, position_id: "Product Manager", term: "3A" },
  { targetId: 4, projectIndex: 3, position_id: "Developer", term: "3A" },
  { targetId: 5, projectIndex: 4, position_id: "Developer", term: "2A" },
  { targetId: 6, projectIndex: 5, position_id: "Designer", term: "1B" },
  { targetId: 7, projectIndex: 6, position_id: "Product Manager", term: "4A" },
  { targetId: 8, projectIndex: 7, position_id: "Developer", term: "3B" },
  { targetId: 9, projectIndex: 8, position_id: "VP Design", term: "1A" },
  { targetId: 10, projectIndex: 9, position_id: "Developer", term: "2A" },
  { targetId: 11, projectIndex: 10, position_id: "Designer", term: "2A" },
  {
    targetId: 12,
    projectIndex: 11,
    position_id: "Product Manager",
    term: "3A",
  },
];

const USER_IDS = TEST_USER_TERM_RECORDS.map((r) => userId(r.targetId));

export const up: Seeder = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  const now = new Date();

  const projectIds = PROJECT_NAMES.map(() => v4());

  const t = await sequelize.transaction();
  try {
    await queryInterface.bulkInsert(
      "users",
      TEST_USER_TERM_RECORDS.map(({ targetId }) => ({
        id: userId(targetId),
        first_name: `User ${targetId}`,
        last_name: `User ${targetId}`,
        auth_id: `${SEED_EMAIL_PREFIX}${targetId}@example.com`,
        role: "User",
        email: `${SEED_EMAIL_PREFIX}${targetId}@example.com`,
        createdAt: now,
        updatedAt: now,
      })),
      { transaction: t },
    );

    await queryInterface.bulkInsert(
      "projects",
      PROJECT_NAMES.map((project_name, i) => ({
        id: projectIds[i],
        project_name,
        is_archived: false,
      })),
      { transaction: t },
    );

    await queryInterface.bulkInsert(
      "user_term_records",
      TEST_USER_TERM_RECORDS.map(
        ({ targetId, projectIndex, position_id, term }) => ({
          user_id: userId(targetId),
          project_id: projectIds[projectIndex],
          position_id,
          term,
          createdAt: now,
          updatedAt: now,
        }),
      ),
      { transaction: t },
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const down: Seeder = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  const t = await sequelize.transaction();
  try {
    const PROJECT_NAMES = Array.from(
      { length: 12 },
      (_, i) => `Term Records Seed Project ${i + 1}`,
    );

    // Reverse order of `up`: rows holding foreign keys go first.
    await queryInterface.bulkDelete(
      "user_term_records",
      { user_id: USER_IDS },
      { transaction: t },
    );

    await queryInterface.bulkDelete(
      "users",
      { id: USER_IDS },
      { transaction: t },
    );

    await queryInterface.bulkDelete(
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
