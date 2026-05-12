import { makeExecutableSchema } from "apollo-server-express";

import typeDefs from "./typeDefs";

const schema = makeExecutableSchema({
  typeDefs,
});

export default schema;
