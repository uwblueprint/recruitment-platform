import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert("positions", [
    {
      title: "Project Lead",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Developer",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "VP Engineering",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Designer",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "VP Design",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Product Manager",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "VP Product",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "President",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "VP Scoping",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "VP Talent",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "VP Finance",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Director Lead",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Internal Director",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "External Director",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Content Strategist",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Graphic Designer",
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("positions", {
    title: [
      "Project Lead",
      "Developer",
      "VP Engineering",
      "Designer",
      "VP Design",
      "Product Manager",
      "VP Product",
      "President",
      "VP Scoping",
      "VP Talent",
      "VP Finance",
      "Director Lead",
      "Internal Director",
      "External Director",
      "Content Strategist",
      "Graphic Designer",
    ],
  });
};
