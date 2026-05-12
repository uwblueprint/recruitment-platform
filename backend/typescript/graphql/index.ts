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
    adminCommentsByApplicantRecordId: authorizedByAdmin(),
    adminCommentById: authorizedByAdmin(),
    getInterviewDelegation: authorizedByAllRoles(),
    getInterviewedApplicantsByUserId: authorizedByAllRoles(),
    getInterviewedPairingsByUserId: authorizedByAllRoles(),
    getInterviewersByGroupId: authorizedByAllRoles(),
    getInterviewGroupById: authorizedByAllRoles(),
    getReviewedApplicantRecord: authorizedByAllRoles(),
  },
  Mutation: {
    bulkCreateInterviewDelegations: authorizedByAllRoles(),
    bulkCreateInterviewGroups: authorizedByAllRoles(),
    bulkCreateReviewedApplicantRecord: authorizedByAllRoles(),
    bulkDeleteInterviewDelegations: authorizedByAllRoles(),
    bulkDeleteInterviewGroupsByIds: authorizedByAllRoles(),
    bulkDeleteReviewedApplicantRecord: authorizedByAllRoles(),
    createAdminComment: authorizedByAdmin(),
    createEntity: authorizedByAllRoles(),
    createInterviewDelegation: authorizedByAllRoles(),
    createInterviewGroup: authorizedByAllRoles(),
    createReviewedApplicantRecord: authorizedByAllRoles(),
    updateEntity: authorizedByAllRoles(),
    deleteEntity: authorizedByAllRoles(),
    delegateInterviewers: authorizedByAllRoles(),
    deleteAdminCommentById: authorizedByAdmin(),
    deleteInterviewDelegation: authorizedByAllRoles(),
    deleteInterviewGroupById: authorizedByAllRoles(),
    deleteReviewedApplicantRecord: authorizedByAllRoles(),
    createSimpleEntity: authorizedByAllRoles(),
    updateSimpleEntity: authorizedByAllRoles(),
    deleteSimpleEntity: authorizedByAllRoles(),
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedBySuperAdmin(),
    deleteUserByEmail: authorizedBySuperAdmin(),
    logout: isAuthorizedByUserId("userId"),
    resetPassword: isAuthorizedByEmail("email"),
    sendSignInLink: authorizedByAllRoles(),
    updateAdminComment: authorizedByAdmin(),
    updateInterviewDelegation: authorizedByAllRoles(),
    updateInterviewGroup: authorizedByAllRoles(),
    updateReviewedApplicantRecord: authorizedByAllRoles(),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);
