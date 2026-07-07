import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";

import {
  isAuthorizedByEmail,
  isAuthorizedByRole,
  isAuthorizedByUserId,
} from "../middlewares/auth";
import adminCommentResolvers from "./resolvers/adminCommentResolvers";
import applicantRecordResolvers from "./resolvers/applicantRecordResolvers";
import authResolvers from "./resolvers/authResolvers";
import entityResolvers from "./resolvers/entityResolvers";
import simpleEntityResolvers from "./resolvers/simpleEntityResolvers";
import reviewedApplicantRecordResolvers from "./resolvers/reviewedApplicantRecordResolvers";
import reviewDashboardResolvers from "./resolvers/reviewDashboardResolvers";
import reviewPageResolvers from "./resolvers/reviewPageResolvers";
import userResolvers from "./resolvers/userResolvers";
import adminCommentType from "./types/adminCommentType";
import applicantRecordType from "./types/applicantRecordType";
import authType from "./types/authType";
import entityType from "./types/entityType";
import interviewDashboardTypes from "./types/interviewDashboardType";
import interviewDelegationsTypes from "./types/interviewDelegationType";
import interviewedApplicantRecordsTypes from "./types/interviewedApplicantRecordsType";
import interviewGroupTypes from "./types/interviewGroupType";
import interviewPageType from "./types/interviewPageType";
import reviewDashboardType from "./types/reviewDashboardType";
import reviewedApplicantRecordTypes from "./types/reviewedApplicantRecordType";
import reviewPageType from "./types/reviewPageType";
import simpleEntityType from "./types/simpleEntityType";
import userType from "./types/userType";
import interviewedApplicantRecordResolvers from "./resolvers/interviewedApplicantRecordResolvers";
import interviewDelegationResolvers from "./resolvers/interviewDelegationResolvers";
import interviewGroupResolvers from "./resolvers/interviewGroupResolvers";
import interviewPageResolvers from "./resolvers/interviewPageResolvers";
import interviewDashboardResolvers from "./resolvers/interviewDashboardResolvers";

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
    adminCommentResolvers,
    applicantRecordResolvers,
    authResolvers,
    entityResolvers,
    interviewedApplicantRecordResolvers,
    simpleEntityResolvers,
    reviewedApplicantRecordResolvers,
    reviewDashboardResolvers,
    reviewPageResolvers,
    userResolvers,
    interviewDelegationResolvers,
    interviewGroupResolvers,
    interviewPageResolvers,
    interviewDashboardResolvers,
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
    adminCommentsByApplicantRecordId: authorizedByAdmin(),
    adminCommentById: authorizedByAdmin(),
    reviewedApplicantRecord: authorizedByAdmin(),
    reviewedApplicantRecordsByApplicantRecordId: authorizedByAdmin(),
    reviewedApplicantsByUserId: authorizedByAllRoles(),
    application: authorizedByAllRoles(),
    interviewedApplicantRecord: authorizedByAllRoles(),
    interviewDelegation: authorizedByAllRoles(),
    interviewGroup: authorizedByAllRoles(),
    interviewedApplicantsByUserId: authorizedByAllRoles(),
    interviewedPairingsByUserId: authorizedByAllRoles(),
    interviewersByGroupId: authorizedByAllRoles(),
    reviewDashboard: authorizedByAdmin(),
    reviewDashboardSidePanel: authorizedByAdmin(),
    interviewDashboard: authorizedByAdmin(),
    interviewInvites: authorizedByAdmin(),
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
    createAdminComment: authorizedByAdmin(),
    updateAdminComment: authorizedByAdmin(),
    deleteAdminCommentById: authorizedByAdmin(),
    updateApplicantRecordStatus: authorizedByAllRoles(),
    bulkUpdateApplicantRecordsStatus: authorizedByAdmin(),
    updateApplicantRecordIsApplicantFlagged: authorizedByAdmin(),
    createReviewedApplicantRecord: authorizedByAdmin(),
    updateReviewedApplicantRecord: authorizedByAllRoles(),
    deleteReviewedApplicantRecord: authorizedByAdmin(),
    bulkCreateReviewedApplicantRecord: authorizedByAdmin(),
    reportReviewConflict: authorizedByAllRoles(),
    reportInterviewConflict: authorizedByAllRoles(),
    createInterviewedApplicantRecord: authorizedByAdmin(),
    updateInterviewedApplicantRecord: authorizedByAllRoles(),
    deleteInterviewedApplicantRecordById: authorizedByAdmin(),
    createInterviewDelegation: authorizedByAdmin(),
    updateInterviewDelegation: authorizedByAdmin(),
    deleteInterviewDelegation: authorizedByAdmin(),
    bulkCreateInterviewDelegations: authorizedByAdmin(),
    createInterviewGroup: authorizedByAdmin(),
    updateInterviewGroup: authorizedByAdmin(),
    updateInterviewGroupSchedulingLink: authorizedByAllRoles(),
    deleteInterviewGroupById: authorizedByAdmin(),
    bulkCreateInterviewGroups: authorizedByAdmin(),
    bulkDeleteInterviewGroupsByIds: authorizedByAdmin(),
    delegateReviewers: authorizedBySuperAdmin(),
    delegateInterviewers: authorizedBySuperAdmin(),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);
