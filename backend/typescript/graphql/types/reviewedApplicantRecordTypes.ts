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

  input CreateReviewedApplicantRecordDTO {
    applicantRecordId: ID!
    reviewerId: Int!
    review: ReviewInput!
    status: ReviewStatus!
    reviewerHasConflict: Boolean!
  }

  input UpdateReviewedApplicantRecordDTO {
    review: ReviewInput
    status: ReviewStatus
    reviewerHasConflict: Boolean
  }

  extend type Query {
    getReviewedApplicantRecord(
      applicantRecordId: ID!
      reviewerId: Int!
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
      reviewerId: Int!
    ): ReviewedApplicantRecordDTO!

    updateReviewedApplicantRecord(
      applicantRecordId: ID!
      reviewerId: Int!
      reviewedApplicantRecord: UpdateReviewedApplicantRecordDTO!
    ): ReviewedApplicantRecordDTO!
  }
`;

export default reviewedApplicantRecordTypes;
