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

  extend type Query {
    interviewDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
    ): [InterviewDashboardRowDTO!]!
  }

  extend type Mutation {
    delegateInterviewers(positions: [String!]!): [InterviewDelegationDTO!]!
  }
`;

export default interviewDashboardTypes;
