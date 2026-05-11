import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("users", [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      auth_id: "123",
      role: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Doe",
      auth_id: "456",
      role: "User",
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
