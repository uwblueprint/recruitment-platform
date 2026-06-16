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

  extend type Query {
    interviewedApplicantsByUserId(userId: ID!): [InterviewedApplicantsDTO!]!
    interviewedPairingsByUserId(userId: ID!): [InterviewPairingsDTO!]!
    interviewersByGroupId(groupId: ID!): [UserDTO!]!
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
