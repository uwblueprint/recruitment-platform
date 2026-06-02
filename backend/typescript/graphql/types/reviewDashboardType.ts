import { gql } from "apollo-server-express";

const reviewDashboardType = gql`
  type ReviewDashboardReviewDetails {
    reviewer: UserDTO!
    review: Review
    reviewStatus: ReviewStatus!
  }

  type ReviewDashboardRowDTO {
    applicantRecordId: ID!
    firstName: String!
    lastName: String!
    position: String!
    timesApplied: String!
    applicationStatus: ApplicationStatus!
    choice: Int!
    reviewers: [UserDTO!]!
    totalScore: Int
  }

  type ReviewDashboardSidePanelDTO {
    firstName: String!
    lastName: String!
    position: String!
    program: String!
    resumeUrl: String!
    applicationStatus: ApplicationStatus!
    skillCategory: SkillCategory
    reviewDetails: [ReviewDashboardReviewDetails!]!
  }

  extend type Query {
    reviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
    ): [ReviewDashboardRowDTO!]!

    reviewDashboardSidePanel(
      applicantRecordId: ID!
    ): ReviewDashboardSidePanelDTO!
  }

  extend type Mutation {
    delegateReviewers(positions: [String!]!): [ReviewedApplicantRecordDTO!]!
  }
`;

export default reviewDashboardType;
