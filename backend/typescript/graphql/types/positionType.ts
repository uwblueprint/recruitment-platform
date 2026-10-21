import { gql } from "apollo-server-express";

const positionType = gql`
  type PositionDTO {
    title: String!
    isArchived: Boolean!
  }

  extend type Query {
    positions: [PositionDTO!]!
  }
`;

export default positionType;
