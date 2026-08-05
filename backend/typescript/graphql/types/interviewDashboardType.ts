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
    interviewNotesId: String
    interviewDate: String
  }

  extend type Query {
    interviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
    ): [InterviewDashboardRowDTO!]!

    interviewDashboardSidePanel(
      applicantRecordId: ID!
    ): InterviewDashboardSidePanelDTO!
  }

  extend type Mutation {
    delegateInterviewers(positions: [String!]!): [InterviewDelegationDTO!]!
  }
`;

export default interviewDashboardTypes;
