import { gql } from "apollo-server-express";

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

const typeDefs = [
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
];

export default typeDefs;
