import { gql } from "apollo-server-express";

const reviewDashboardType = gql`
  type ReviewDashboardReviewDetails {
    reviewer: UserDTO!
    review: Review
    reviewStatus: ReviewStatus!
  }

  type ReviewDashboardRowDTO {
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

  enum ReviewDashboardSortBy {
    FIRST_NAME
    LAST_NAME
    CHOICE
    TIMES_APPLIED
    REVIEWER_1
    REVIEWER_2
    TOTAL_SCORE
    APPLICATION_STATUS
  }

  extend type Query {
    reviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
      sortBy: ReviewDashboardSortBy
      sortAscending: Boolean
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
