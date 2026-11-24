import type { Seeder } from "../umzug-seed";

// Role labels used verbatim by the UWBlueprint applicant Firebase export.
// Ingestion stores them as-is in applicant_records.position, so each one needs
// a matching positions.title row. Titles already created by
// create-bp-positions are skipped.
const FIREBASE_EXPORT_POSITIONS = [
  "Project Lead",
  "Project Developer",
  "Product Designer",
  "Product Manager",
  "User Experience Researcher",
  "Graphic Designer",
  "Internal Director",
  "External Director",
  "VP Engineering",
  "VP Product",
  "VP Talent",
  "VP Finance & Operations",
  "VP Project Scoping",
];

// Only the titles this seeder adds, so `down` leaves create-bp-positions alone.
const ADDED_POSITIONS = [
  "Project Developer",
  "Product Designer",
  "User Experience Researcher",
  "VP Finance & Operations",
  "VP Project Scoping",
];

export const up: Seeder = async ({ context: sequelize }) => {
  const queryInterface = sequelize.getQueryInterface();
  const [existing] = (await queryInterface.sequelize.query(
    "SELECT title FROM positions",
  )) as [{ title: string }[], unknown];
  const existingTitles = new Set(existing.map((row) => row.title));

  const missing = FIREBASE_EXPORT_POSITIONS.filter(
    (title) => !existingTitles.has(title),
  );
  if (missing.length === 0) return;

  await queryInterface.bulkInsert(
    "positions",
    missing.map((title) => ({
      title,
      is_archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );
};

export const down: Seeder = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete("positions", {
    title: ADDED_POSITIONS,
  });
};
