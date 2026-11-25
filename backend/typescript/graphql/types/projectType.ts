import { gql } from "apollo-server-express";

const projectType = gql`
  type ProjectDTO {
    id: ID!
    projectName: String!
    isArchived: Boolean!
  }

  extend type Query {
    projects(isArchived: Boolean): [ProjectDTO!]!
  }

  extend type Mutation {
    archiveProject(id: ID!): ProjectDTO!
  }
`;

export default projectType;
