import { gql } from "apollo-server-express";

const interviewedApplicantRecordsTypes = gql`
  enum InterviewStatus {
    NEEDS_REVIEW
    IN_PROGRESS
    COMPLETE
    CONFLICT_REPORTED
  }

  type Interview {
    passionFSG: Int
    teamPlayer: Int
    desireToLearn: Int
    skill: Int
    skillCategory: SkillCategory
    comments: String
  }

  input InterviewInput {
    passionFSG: Int
    teamPlayer: Int
    desireToLearn: Int
    skill: Int
    skillCategory: SkillCategory
    comments: String
  }

  type InterviewedApplicantRecord {
    id: ID!
    applicantRecordId: ID!
    score: Int
    interviewJson: Interview
    status: InterviewStatus!
    interviewNotesId: String
    interviewDate: String
  }

  input CreateInterviewedApplicantRecordDTO {
    applicantRecordId: ID!
  }

  input UpdateInterviewedApplicantRecordDTO {
    score: Int
    interviewJson: InterviewInput
    status: InterviewStatus
    interviewNotesId: String
    interviewDate: String
  }

  extend type Query {
    interviewedApplicantRecord(
      interviewedApplicantRecordId: ID!
    ): InterviewedApplicantRecord!
  }

  extend type Mutation {
    createInterviewedApplicantRecord(
      interviewedApplicantRecord: CreateInterviewedApplicantRecordDTO!
    ): InterviewedApplicantRecord!

    updateInterviewedApplicantRecord(
      interviewedApplicantRecordId: ID!
      interviewedApplicantRecord: UpdateInterviewedApplicantRecordDTO!
    ): InterviewedApplicantRecord!

    deleteInterviewedApplicantRecordById(
      interviewedApplicantRecordId: ID!
    ): InterviewedApplicantRecord!
  }
`;

export default interviewedApplicantRecordsTypes;
