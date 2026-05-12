import { merge } from "lodash";

import authResolvers from "./resolvers/authResolvers";
import entityResolvers from "./resolvers/entityResolvers";
import simpleEntityResolvers from "./resolvers/simpleEntityResolvers";
import userResolvers from "./resolvers/userResolvers";

const resolvers = merge(
  authResolvers,
  entityResolvers,
  simpleEntityResolvers,
  userResolvers,
);

export default resolvers;
