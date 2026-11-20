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

  type MemberPastTeamDTO {
    team: String
    role: String!
    term: String!
  }

  type MembersDashboardSidePanelDTO {
    id: ID!
    firstName: String!
    lastName: String!
    role: String
    team: String
    joined: String
    isArchived: Boolean!
    pastTeams: [MemberPastTeamDTO!]!
  }

  extend type Query {
    membersDashboardSidePanel(userId: ID!): MembersDashboardSidePanelDTO!
  }
`;

export default membersDashboardType;
