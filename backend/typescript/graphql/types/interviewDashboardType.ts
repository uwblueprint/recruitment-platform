import { gql } from "apollo-server-express";

const interviewDashboardTypes = gql`
  type InterviewDashboardRowDTO {
    applicantRecordId: ID!
    firstName: String!
    lastName: String!
    position: String!
    applicationStatus: ApplicationStatus!
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

  type InterviewDashboardCountsDTO {
    all: Int!
    shortlisted: Int!
    conflicts: Int!
  }

  extend type Query {
    interviewDashboardCounts: InterviewDashboardCountsDTO!
    interviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
      sortBy: InterviewDashboardSortBy
      view: DashboardView
      sortAscending: Boolean
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
