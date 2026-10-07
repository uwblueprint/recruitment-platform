import { gql } from "apollo-server-express";

const interviewDashboardTypes = gql`
  type InterviewDashboardRowDTO {
    applicantRecordId: ID!
    firstName: String!
    lastName: String!
    position: String!
    applicationStatus: ApplicationStatus!
    isApplicantFlagged: Boolean!
    interviewers: [UserDTO!]!
    interviewScore: Int
  }

  type InterviewDashboardSidePanelDTO {
    firstName: String!
    lastName: String!
    term: String!
    program: String!
    position: String!
    resumeUrl: String!
    applicationStatus: ApplicationStatus!
    skillCategory: SkillCategory
    isApplicantFlagged: Boolean!
    isShortlistedForOffer: Boolean!
    interviewers: [UserDTO!]!
    interview: Interview
    interviewStatus: InterviewStatus
    interviewScore: Int
    interviewedApplicantRecordId: ID
    interviewDate: String
  }

  enum InterviewDashboardSortBy {
    FIRST_NAME
    LAST_NAME
    POSITION
    INTERVIEWER_1
    INTERVIEWER_2
    INTERVIEW_SCORE
    APPLICATION_STATUS
  }

  type InterviewInviteeDTO {
    firstName: String!
    lastName: String!
    position: String!
  }

  type InterviewInviteDTO {
    id: ID!
    interviewers: [UserDTO!]!
    interviewees: [InterviewInviteeDTO!]!
    position: String!
    schedulingLink: String
    status: InterviewGroupStatus!
  }

  input InterviewDashboardFilters {
    search: String
    positions: [String!]
    applicationStatuses: [ApplicationStatus!]
    skillCategories: [SkillCategory!]
    years: [String!]
    bookmarked: Boolean
  }

  type InterviewDashboardCountsDTO {
    all: Int!
    shortlisted: Int!
    conflicts: Int!
  }

  extend type Query {
    interviewDashboardCounts(
      filters: InterviewDashboardFilters
    ): InterviewDashboardCountsDTO!
    interviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
      sortBy: InterviewDashboardSortBy
      view: DashboardView
      sortAscending: Boolean
      filters: InterviewDashboardFilters
    ): [InterviewDashboardRowDTO!]!

    interviewDashboardSidePanel(
      applicantRecordId: ID!
    ): InterviewDashboardSidePanelDTO!
    interviewInvites: [InterviewInviteDTO!]!
  }

  extend type Mutation {
    delegateInterviewers(positions: [String!]!): [InterviewDelegationDTO!]!
  }
`;

export default interviewDashboardTypes;
