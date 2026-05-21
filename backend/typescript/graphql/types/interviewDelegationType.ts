import { gql } from "apollo-server-express";

const interviewDelegationsTypes = gql`
  enum InterviewConflict {
    APPLICANT_CONFLICT
    APPLICANT_NO_RESPONSE
    PARTNER_NO_RESPONSE
    CANNOT_ATTEND
  }

  type InterviewDelegationDTO {
    interviewedApplicantRecordId: ID!
    interviewerId: ID!
    interviewHasConflict: InterviewConflict
    groupId: ID!
  }

  input CreateInterviewDelegationDTO {
    interviewedApplicantRecordId: ID!
    interviewerId: ID!
    groupId: ID!
  }

  input UpdateInterviewDelegationDTO {
    interviewHasConflict: InterviewConflict
  }

  extend type Query {
    interviewDelegation(
      interviewedApplicantRecordId: ID!
      interviewerId: ID!
    ): InterviewDelegationDTO!
  }

  extend type Mutation {
    createInterviewDelegation(
      interviewDelegation: CreateInterviewDelegationDTO!
    ): InterviewDelegationDTO!

    updateInterviewDelegation(
      interviewedApplicantRecordId: ID!
      interviewerId: ID!
      interviewDelegation: UpdateInterviewDelegationDTO!
    ): InterviewDelegationDTO!

    deleteInterviewDelegation(
      interviewedApplicantRecordId: ID!
      interviewerId: ID!
    ): InterviewDelegationDTO!

    bulkCreateInterviewDelegations(
      delegations: [CreateInterviewDelegationDTO!]!
    ): [InterviewDelegationDTO!]!
  }
`;

export default interviewDelegationsTypes;
