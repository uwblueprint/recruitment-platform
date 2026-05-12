import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("users", [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      auth_id: "123",
      role: "Admin",
      email: "create_test_user1_john_doe@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Doe",
      auth_id: "456",
      role: "User",
      email: "create_test_user2_jane_doe@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("users", {
    id: [1, 2],
  });
};
