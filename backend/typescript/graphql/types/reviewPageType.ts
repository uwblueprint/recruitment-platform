import { gql } from "apollo-server-express";

const reviewPageType = gql`
  type ApplicationDTO {
    id: ID!
    academicOrCoop: String!
    academicYear: String!
    email: String!
    firstName: String!
    lastName: String!
    heardFrom: String!
    locationPreference: String!
    program: String!
    position: String!
    pronouns: String!
    pronounsSpecified: String!
    resumeUrl: String!
    roleSpecificQuestions: [ShortAnswerQuestion!]!
    shortAnswerQuestions: [ShortAnswerQuestion!]!
    status: ApplicationStatus!
    term: String!
    timesApplied: String!
  }

  type ReviewedApplicantsDTO {
    applicantRecordId: ID!
    reviewStatus: ReviewStatus!
    applicantFirstName: String!
    applicantLastName: String!
  }

  extend type Mutation {
    reportReviewConflict(
      applicantRecordId: ID!
      reviewerId: ID!
    ): ReviewedApplicantRecordDTO!
  }

  extend type Query {
    application(applicantRecordId: ID!): ApplicationDTO!
    reviewedApplicantsByUserId(userId: ID!): [ReviewedApplicantsDTO!]!
  }
`;

export default reviewPageType;
