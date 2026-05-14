import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";

import {
  isAuthorizedByEmail,
  isAuthorizedByRole,
  isAuthorizedByUserId,
} from "../middlewares/auth";
import authResolvers from "./resolvers/authResolvers";
import entityResolvers from "./resolvers/entityResolvers";
import simpleEntityResolvers from "./resolvers/simpleEntityResolvers";
import userResolvers from "./resolvers/userResolvers";
import adminCommentType from "./types/adminCommentsType";
import applicantRecordType from "./types/applicantRecordType";
import authType from "./types/authType";
import entityType from "./types/entityType";
import interviewDashboardTypes from "./types/interviewDashboardTypes";
import interviewDelegationsTypes from "./types/interviewDelegationsTypes";
import interviewedApplicantRecordsTypes from "./types/interviewedApplicantRecordsTypes";
import interviewGroupTypes from "./types/interviewGroupTypes";
import interviewPageType from "./types/interviewPageTypes";
import reviewDashboardType from "./types/reviewDashboardType";
import reviewedApplicantRecordTypes from "./types/reviewedApplicantRecordTypes";
import reviewPageType from "./types/reviewPageType";
import simpleEntityType from "./types/simpleEntityType";
import userType from "./types/userType";

const query = gql`
  type Query {
    _empty: String
  }
`;

const mutation = gql`
  type Mutation {
    _empty: String
  }
`;

const executableSchema = makeExecutableSchema({
  typeDefs: [
    query,
    mutation,
    adminCommentType,
    applicantRecordType,
    authType,
    entityType,
    interviewDashboardTypes,
    interviewDelegationsTypes,
    interviewGroupTypes,
    interviewPageType,
    interviewedApplicantRecordsTypes,
    reviewDashboardType,
    reviewedApplicantRecordTypes,
    reviewPageType,
    simpleEntityType,
    userType,
  ],
  resolvers: merge(
    authResolvers,
    entityResolvers,
    simpleEntityResolvers,
    userResolvers,
  ),
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
