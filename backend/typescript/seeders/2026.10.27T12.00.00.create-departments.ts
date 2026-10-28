import type { Seeder } from "../umzug-seed";

// Positions each navbar department's dashboards are scoped to. Positions left
// out of every department only appear in the all-roles Recruitment view.
const DEPARTMENTS = [
  {
    slug: "community",
    name: "Community",
    positions: [
      "President",
      "VP Scoping",
      "VP Talent",
      "VP Finance",
      "Director Lead",
      "Internal Director",
      "External Director",
      "Content Strategist",
    ],
  },
  {
    slug: "product",
    name: "Product",
    positions: ["Product Manager", "VP Product"],
  },
  {
    slug: "design",
    name: "Design",
    positions: ["Designer", "Graphic Designer", "VP Design"],
  },
  {
    slug: "engineering",
    name: "Engineering",
    positions: ["Project Lead", "Developer", "VP Engineering"],
  },
];

export const up: Seeder = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.bulkInsert(
    "departments",
    DEPARTMENTS.map(({ slug, name }) => ({
      slug,
      name,
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );

  await Promise.all(
    DEPARTMENTS.map(({ slug, positions }) =>
      queryInterface.bulkUpdate(
        "positions",
        { department: slug },
        { title: positions },
      ),
    ),
  );
};

export const down: Seeder = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  const slugs = DEPARTMENTS.map(({ slug }) => slug);

  await queryInterface.bulkUpdate(
    "positions",
    { department: null },
    { department: slugs },
  );
  await queryInterface.bulkDelete("departments", { slug: slugs });
};
