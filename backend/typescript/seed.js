/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node/register");

require("./umzug-seed").seedMigrator.runAsCLI();
