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

  enum InterviewDashboardSortBy {
    FIRST_NAME
    LAST_NAME
    POSITION
    INTERVIEWER_1
    INTERVIEWER_2
    INTERVIEW_SCORE
    APPLICATION_STATUS
  }

  extend type Query {
    interviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
      sortBy: InterviewDashboardSortBy
      sortAscending: Boolean
    ): [InterviewDashboardRowDTO!]!
  }

  extend type Mutation {
    delegateInterviewers(positions: [String!]!): [InterviewDelegationDTO!]!
  }
`;

export default interviewDashboardTypes;
