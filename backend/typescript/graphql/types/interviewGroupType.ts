import { gql } from "apollo-server-express";

const interviewGroupTypes = gql`
  enum InterviewGroupStatus {
    READY_TO_INTERVIEW
    INVITES_SENT
    AVAILABILITY_PENDING
  }

  type InterviewGroupDTO {
    id: ID!
    schedulingLink: String
    status: InterviewGroupStatus!
  }

  input CreateInterviewGroupDTO {
    schedulingLink: String
    status: InterviewGroupStatus
  }

  input UpdateInterviewGroupDTO {
    schedulingLink: String
    status: InterviewGroupStatus
  }

  extend type Query {
    canAccessInterviewGroup(groupId: ID!): Boolean!
    interviewGroup(groupId: ID!): InterviewGroupDTO!
  }

  extend type Mutation {
    createInterviewGroup(
      interviewGroup: CreateInterviewGroupDTO!
    ): InterviewGroupDTO!

    updateInterviewGroup(
      groupId: ID!
      interviewGroup: UpdateInterviewGroupDTO!
    ): InterviewGroupDTO!

    updateInterviewGroupSchedulingLink(
      groupId: ID!
      schedulingLink: String!
    ): InterviewGroupDTO!

    deleteInterviewGroupById(groupId: ID!): InterviewGroupDTO!

    bulkCreateInterviewGroups(
      interviewGroups: [CreateInterviewGroupDTO]!
    ): [InterviewGroupDTO]!

    bulkDeleteInterviewGroupsByIds(
      interviewGroupIds: [ID]!
    ): [InterviewGroupDTO]!
  }
`;

export default interviewGroupTypes;
