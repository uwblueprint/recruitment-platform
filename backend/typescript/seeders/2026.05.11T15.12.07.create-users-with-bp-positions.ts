import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("users", [
    {
      id: 3,
      first_name: "Jesse",
      last_name: "Huang",
      auth_id: "jesse_huang_123",
      role: "SuperAdmin",
      position: "President",
      is_archived: false,
      email: "jesse_huang_123@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      first_name: "Carolyn",
      last_name: "Zhang",
      auth_id: "carolyn_zhang_456",
      role: "Admin",
      position: "VP Engineering",
      is_archived: false,
      email: "carolyn_zhang_456@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("users", {
    id: [3, 4],
  });
};
