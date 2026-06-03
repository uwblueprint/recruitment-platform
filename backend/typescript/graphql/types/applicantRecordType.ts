import { gql } from "apollo-server-express";

const applicantRecordType = gql`
  enum ApplicationStatus {
    APPLIED
    IN_REVIEW
    REVIEWED
    SELECTED
    INTERVIEWED
    OFFERED
    REJECTED
  }

  type ShortAnswerQuestion {
    question: String!
    response: String!
  }

  type ApplicantRecordDTO {
    id: ID!
    applicantId: ID!
    position: String!
    roleSpecificQuestions: [ShortAnswerQuestion!]!
    choice: Int!
    status: ApplicationStatus!
    skillCategory: SkillCategory
    combinedReviewScore: Int
    isApplicantFlagged: Boolean!
  }

  extend type Mutation {
    updateApplicantRecordStatus(
      id: ID!
      status: ApplicationStatus!
    ): ApplicantRecordDTO!
    bulkUpdateApplicantRecordsStatus(
      ids: [ID!]!
      status: ApplicationStatus!
    ): [ApplicantRecordDTO!]!
    updateApplicantRecordIsApplicantFlagged(
      id: ID!
      flagValue: Boolean!
    ): ApplicantRecordDTO!
  }
`;

export default applicantRecordType;
