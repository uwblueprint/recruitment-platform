import { gql } from "apollo-server-express";

const interviewPageType = gql`
  type InterviewedApplicantsDTO {
    applicantRecordId: ID!
    interviewStatus: InterviewStatus!
    applicantFirstName: String!
    applicantLastName: String!
  }

  type InterviewPairingsDTO {
    interviewedGroupId: ID!
    interviewGroupStatus: InterviewGroupStatus!
    groupMembers: [UserDTO!]!
  }

  type InterviewNotes {
    fileId: ID!
    fileName: String!
    signedUrl: String!
  }

  extend type Query {
    interviewedApplicantsByUserId(userId: ID!): [InterviewedApplicantsDTO!]!
    interviewedPairingsByUserId(userId: ID!): [InterviewPairingsDTO!]!
    interviewersByGroupId(groupId: ID!): [UserDTO!]!
    interviewNotes(fileId: ID!): InterviewNotes!
  }

  extend type Mutation {
    reportInterviewConflict(
      interviewedApplicantRecordId: ID!
      interviewerId: ID!
      interviewHasConflict: InterviewConflict!
    ): InterviewedApplicantRecord!
  }
`;

export default interviewPageType;
