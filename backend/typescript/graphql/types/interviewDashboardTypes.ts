import { gql } from "apollo-server-express";

const interviewDashboardTypes = gql`
  extend type Mutation {
    delegateInterviewers(positions: [String!]!): [InterviewDelegationDTO!]!
  }
`;

export default interviewDashboardTypes;
