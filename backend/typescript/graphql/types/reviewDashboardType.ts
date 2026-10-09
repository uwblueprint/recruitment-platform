import { gql } from "apollo-server-express";

const reviewDashboardType = gql`
  type ReviewDashboardReviewDetails {
    reviewer: UserDTO!
    review: Review
    reviewStatus: ReviewStatus!
  }

  type ReviewDashboardReviewerDTO {
    userInfo: UserDTO!
    reviewerHasConflict: Boolean!
  }

  type ReviewDashboardRowDTO {
    applicantRecordId: ID!
    firstName: String!
    lastName: String!
    position: String!
    timesApplied: String!
    applicationStatus: ApplicationStatus!
    choice: Int!
    reviewers: [ReviewDashboardReviewerDTO!]!
    totalScore: Int
    isApplicantFlagged: Boolean!
  }

  type ReviewDashboardSidePanelDTO {
    firstName: String!
    lastName: String!
    position: String!
    program: String!
    academicYear: String!
    resumeUrl: String!
    applicationStatus: ApplicationStatus!
    skillCategory: SkillCategory
    reviewDetails: [ReviewDashboardReviewDetails!]!
    shortlistedForInterview: Boolean!
    isApplicantFlagged: Boolean!
  }

  type FilterOption {
    value: String!
    label: String!
  }

  type ReviewDashboardFilterOptionsDTO {
    positions: [FilterOption!]!
    applicationStatuses: [FilterOption!]!
    skillCategories: [FilterOption!]!
    scoreRanges: [FilterOption!]!
    years: [FilterOption!]!
    bookmarked: [FilterOption!]!
  }

  input ReviewDashboardFilters {
    search: String
    positions: [String!]
    applicationStatuses: [ApplicationStatus!]
    skillCategories: [SkillCategory!]
    scoreRanges: [String!]
    years: [String!]
    bookmarked: Boolean
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

  enum DashboardView {
    ALL
    SHORTLISTED
    CONFLICTS
  }

  type ReviewDashboardCountsDTO {
    all: Int!
    shortlisted: Int!
    conflicts: Int!
  }

  extend type Query {
    reviewDashboardCounts(
      filters: ReviewDashboardFilters
    ): ReviewDashboardCountsDTO!
    reviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
      sortBy: ReviewDashboardSortBy
      sortAscending: Boolean
      filters: ReviewDashboardFilters
      view: DashboardView
    ): [ReviewDashboardRowDTO!]!

    reviewDashboardApplicantRecordIds(
      sortBy: ReviewDashboardSortBy
      sortAscending: Boolean
      filters: ReviewDashboardFilters
    ): [ID!]!

    reviewDashboardCSV: String!

    reviewDashboardSidePanel(
      applicantRecordId: ID!
    ): ReviewDashboardSidePanelDTO!

    reviewDashboardFilterOptions(
      department: String
    ): ReviewDashboardFilterOptionsDTO!
  }

  extend type Mutation {
    delegateReviewers(positions: [String!]!): [ReviewedApplicantRecordDTO!]!
  }
`;

export default reviewDashboardType;
