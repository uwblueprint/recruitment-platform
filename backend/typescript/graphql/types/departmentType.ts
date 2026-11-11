import { gql } from "apollo-server-express";

const departmentType = gql`
  type DepartmentDTO {
    slug: String!
    name: String!
  }

  extend type Query {
    departments: [DepartmentDTO!]!
  }
`;

export default departmentType;
