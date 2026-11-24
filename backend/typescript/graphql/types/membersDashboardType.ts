import { gql } from "apollo-server-express";

const membersDashboardType = gql`
  type MembersDashboardRowDTO {
    id: ID!
    firstName: String!
    lastName: String!
    role: String
    team: String
    joined: String
    isArchived: Boolean!
  }

  extend type Query {
    membersDashboard(
      pageNumber: Int!
      resultsPerPage: Int!
    ): [MembersDashboardRowDTO!]!
    membersDashboardCount: Int!
  }
`;

export default membersDashboardType;
