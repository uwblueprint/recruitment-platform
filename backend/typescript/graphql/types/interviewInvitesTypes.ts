import { gql } from "apollo-server-express";

const interviewInvitesTypes = gql`
  input InterviewInvitesFilters {
    search: String
    positions: [String!]
  }

  type InterviewInvitesCountsDTO {
    ready: Int!
    sent: Int!
  }

  type InterviewInviteeDTO {
    firstName: String!
    lastName: String!
    position: String!
  }

  type InterviewInviteDTO {
    id: ID!
    interviewers: [UserDTO!]!
    interviewees: [InterviewInviteeDTO!]!
    position: String!
    schedulingLink: String
    status: InterviewGroupStatus!
  }

  type UnmatchedApplicantDTO {
    applicantRecordId: ID!
    interviewedApplicantRecordId: ID!
    firstName: String!
    lastName: String!
  }

  type InterviewUnmatchedApplicantsByPositionDTO {
    position: String!
    applicants: [UnmatchedApplicantDTO!]!
  }

  extend type Query {
    interviewUnmatchedApplicants: [InterviewUnmatchedApplicantsByPositionDTO!]!
    interviewInvites(
      pageNumber: Int!
      resultsPerPage: Int!
      status: [InterviewGroupStatus!]
      filters: InterviewInvitesFilters
    ): [InterviewInviteDTO!]!
    interviewInvitesCounts(
      filters: InterviewInvitesFilters
    ): InterviewInvitesCountsDTO!
  }
`;

export default interviewInvitesTypes;
