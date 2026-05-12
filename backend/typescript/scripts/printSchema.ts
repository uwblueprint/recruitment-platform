import { printSchema } from "graphql";

import schema from "../graphql/schema";

process.stdout.write(printSchema(schema));
