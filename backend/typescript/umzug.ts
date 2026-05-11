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

const migrationTemplate = (filepath: string): [string, string][] => {
  const content = `import type { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {};

export const down: Migration = async ({ context: sequelize }) => {};
`;
  return [[filepath, content]];
};

export const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.ts", { cwd: __dirname }],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
  create: {
    folder: path.join(__dirname, "migrations"),
    template: migrationTemplate,
  },
});

export type Migration = typeof migrator._types.migration;
