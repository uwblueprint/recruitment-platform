import { makeExecutableSchema } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";

import {
  isAuthorizedByEmail,
  isAuthorizedByRole,
  isAuthorizedByUserId,
} from "../middlewares/auth";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const authorizedByAllRoles = () =>
  isAuthorizedByRole(new Set(["User", "Admin", "SuperAdmin"]));
const authorizedByAdmin = () =>
  isAuthorizedByRole(new Set(["Admin", "SuperAdmin"]));
const authorizedBySuperAdmin = () =>
  isAuthorizedByRole(new Set(["SuperAdmin"]));

const graphQLMiddlewares = {
  Query: {
    entity: authorizedByAllRoles(),
    entities: authorizedByAllRoles(),
    simpleEntity: authorizedByAllRoles(),
    simpleEntities: authorizedByAllRoles(),
    userById: authorizedByAdmin(),
    userByEmail: authorizedByAdmin(),
    users: authorizedByAdmin(),
  },
  Mutation: {
    createEntity: authorizedByAllRoles(),
    updateEntity: authorizedByAllRoles(),
    deleteEntity: authorizedByAllRoles(),
    createSimpleEntity: authorizedByAllRoles(),
    updateSimpleEntity: authorizedByAllRoles(),
    deleteSimpleEntity: authorizedByAllRoles(),
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedBySuperAdmin(),
    deleteUserByEmail: authorizedBySuperAdmin(),
    logout: isAuthorizedByUserId("userId"),
    resetPassword: isAuthorizedByEmail("email"),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);
