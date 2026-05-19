import { gql } from "@apollo/client";

export const GET_INTERVIEWED_APPLICANTS_BY_USER_ID = gql`
    query InterviewedApplicantsByUserId($userId: ID!) {
      interviewedApplicantsByUserId(userId: $userId) {
        applicantRecordId
        interviewStatus
        applicantFirstName
        applicantLastName
      }
    }
`;

export const GET_INTERVIEWERS_BY_GROUP_ID = gql`
    query InterviewersByGroupId($groupId: ID!) {
      interviewersByGroupId(groupId: $groupId) {
        id
        firstName
        lastName
        email
        profilePictureFileId
      }
    }
`;