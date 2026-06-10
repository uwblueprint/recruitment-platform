import { gql } from "apollo-server-express";

const reviewedApplicantRecordTypes = gql`
  enum SkillCategory {
    JUNIOR
    INTERMEDIATE
    SENIOR
  }

  enum ReviewStatus {
    TODO
    IN_PROGRESS
    DONE
    CONFLICT
  }

  type Review {
    passionFSG: Int
    teamPlayer: Int
    desireToLearn: Int
    skill: Int
    skillCategory: SkillCategory
    comments: String
  }

  input ReviewInput {
    passionFSG: Int
    teamPlayer: Int
    desireToLearn: Int
    skill: Int
    skillCategory: SkillCategory
    comments: String
  }

  type ReviewedApplicantRecordDTO {
    applicantRecordId: ID!
    reviewerId: ID!
    review: Review
    status: String!
    score: Int
    reviewerHasConflict: Boolean!
  }

  type ReviewedApplicantRecordWithReviewerDTO {
    reviewer: UserDTO!
    reviewedApplicantRecord: ReviewedApplicantRecordDTO!
  }

  input CreateReviewedApplicantRecordDTO {
    applicantRecordId: ID!
    reviewerId: ID!
    status: ReviewStatus!
  }

  input UpdateReviewedApplicantRecordDTO {
    review: ReviewInput
    status: ReviewStatus
    reviewerHasConflict: Boolean
  }

  extend type Query {
    reviewedApplicantRecord(
      applicantRecordId: ID!
      reviewerId: ID!
    ): ReviewedApplicantRecordDTO!
  }

  extend type Mutation {
    createReviewedApplicantRecord(
      reviewedApplicantRecord: CreateReviewedApplicantRecordDTO!
    ): ReviewedApplicantRecordDTO!

    bulkCreateReviewedApplicantRecord(
      reviewedApplicantRecords: [CreateReviewedApplicantRecordDTO!]!
    ): [ReviewedApplicantRecordDTO!]!

    deleteReviewedApplicantRecord(
      applicantRecordId: ID!
      reviewerId: ID!
    ): ReviewedApplicantRecordDTO!

    updateReviewedApplicantRecord(
      applicantRecordId: ID!
      reviewerId: ID!
      reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO!
    ): ReviewedApplicantRecordDTO!
  }
`;

export default reviewedApplicantRecordTypes;
