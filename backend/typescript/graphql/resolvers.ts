import { merge } from "lodash";

import adminCommentResolvers from "./resolvers/adminCommentsResolvers";
import applicantRecordResolvers from "./resolvers/applicantRecordResolvers";
import authResolvers from "./resolvers/authResolvers";
import entityResolvers from "./resolvers/entityResolvers";
import interviewDashboardResolvers from "./resolvers/interviewDashboardResolvers";
import interviewDelegationsResolvers from "./resolvers/interviewDelegationsResolvers";
import interviewGroupResolvers from "./resolvers/interviewGroupResolvers";
import interviewPageResolvers from "./resolvers/interviewPageResolvers";
import interviewedApplicantRecordsResolvers from "./resolvers/interviewedApplicantRecordsResolvers";
import reviewDashboardResolvers from "./resolvers/reviewDashboardResolvers";
import reviewedApplicantRecordResolvers from "./resolvers/reviewedApplicantRecordResolver";
import reviewPageResolvers from "./resolvers/reviewPageResolvers";
import simpleEntityResolvers from "./resolvers/simpleEntityResolvers";
import userResolvers from "./resolvers/userResolvers";

const resolvers = merge(
  adminCommentResolvers,
  applicantRecordResolvers,
  authResolvers,
  entityResolvers,
  interviewDashboardResolvers,
  interviewDelegationsResolvers,
  interviewGroupResolvers,
  interviewPageResolvers,
  interviewedApplicantRecordsResolvers,
  reviewDashboardResolvers,
  reviewedApplicantRecordResolvers,
  reviewPageResolvers,
  simpleEntityResolvers,
  userResolvers,
);

export default resolvers;
