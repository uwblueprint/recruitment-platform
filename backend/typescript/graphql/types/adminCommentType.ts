import { gql } from "apollo-server-express";

const adminCommentsType = gql`
  type AdminCommentDTO {
    id: ID!
    userId: ID!
    applicantRecordId: ID!
    comment: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateAdminCommentDTO {
    userId: ID!
    applicantRecordId: ID!
    comment: String!
  }

  input UpdateAdminCommentDTO {
    comment: String!
  }

  extend type Query {
    adminCommentsByApplicantRecordId(
      applicantRecordId: ID!
    ): [AdminCommentDTO!]!
    adminCommentById(id: ID!): AdminCommentDTO!
  }

  extend type Mutation {
    createAdminComment(adminComment: CreateAdminCommentDTO!): AdminCommentDTO!
    updateAdminComment(
      id: ID!
      adminComment: UpdateAdminCommentDTO!
    ): AdminCommentDTO!
    deleteAdminCommentById(id: ID!): AdminCommentDTO!
  }
`;

export default adminCommentsType;
