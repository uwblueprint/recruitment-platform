import type { Seeder } from "../umzug-seed";

const USER_ID_OFFSET = 31000000;
const userId = (targetId: number) => USER_ID_OFFSET + targetId;

const SEED_EMAIL_PREFIX = "seed-term-record-user-";

// fixed projects
const TEST_PROJECTS = [
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a01", project_name: "Project 1" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a02", project_name: "Project 2" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a03", project_name: "Project 3" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a04", project_name: "Project 4" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a05", project_name: "Project 5" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a06", project_name: "Project 6" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a07", project_name: "Project 7" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a08", project_name: "Project 8" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a09", project_name: "Project 9" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a0a", project_name: "Project 10" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a0b", project_name: "Project 11" },
  { id: "6f1c2a3e-8b4d-4e5f-9a1b-0c2d3e4f5a0c", project_name: "Project 12" },
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
const PROJECT_IDS = TEST_PROJECTS.map((p) => p.id);

export const up: Seeder = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  const now = new Date();

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
      TEST_PROJECTS.map((project) => ({
        ...project,
        is_archived: false,
      })),
      { transaction: t },
    );

    await queryInterface.bulkInsert(
      "user_term_records",
      TEST_USER_TERM_RECORDS.map(
        ({ targetId, projectIndex, position_id, term }) => ({
          user_id: userId(targetId),
          project_id: TEST_PROJECTS[projectIndex].id,
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
      { id: PROJECT_IDS },
      { transaction: t },
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
