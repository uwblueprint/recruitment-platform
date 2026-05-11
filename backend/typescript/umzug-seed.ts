import * as path from "path";

import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize-typescript";

const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      process.env.DATABASE_URL!
    : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_DEV}`;

const sequelize = new Sequelize(DATABASE_URL, {
  models: [path.join(__dirname, "/*.model.ts")],
});


const seederTemplate = (filepath: string): [string, string][] => {
  const content = `import type { Seeder } from "../umzug-seed";

export const up: Seeder = async ({ context: _sequelize }) => {};

export const down: Seeder = async ({ context: _sequelize }) => {};
`;
  return [[filepath, content]];
};

export const seedMigrator = new Umzug({
  migrations: {
    glob: ["seeders/*.ts", { cwd: __dirname }],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
    tableName: "SequelizeSeederMeta",
  }),
  logger: console,
  create: {
    folder: path.join(__dirname, "seeders"),
    template: seederTemplate,
  },
});

export type Seeder = typeof seedMigrator._types.migration;
