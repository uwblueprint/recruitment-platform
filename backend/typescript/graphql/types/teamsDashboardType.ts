import { gql } from "apollo-server-express";

const teamsDashboardType = gql`
  type TeamsDashboardMemberDTO {
    id: ID!
    firstName: String!
    lastName: String!
    role: String
    joined: String
    termsOnProject: String!
    isArchived: Boolean!
  }

  type TeamsDashboardTeamDTO {
    id: ID!
    projectName: String!
    isArchived: Boolean!
    members: [TeamsDashboardMemberDTO!]!
  }

  extend type Query {
    teamsDashboard(isArchived: Boolean): [TeamsDashboardTeamDTO!]!
  }
`;

export default teamsDashboardType;
