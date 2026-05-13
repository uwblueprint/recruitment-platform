import { gql } from "@apollo/client";

export const GET_INTERVIEWED_APPLICANTS_BY_USER_ID = gql`
    query GetInterviewedApplicantsByUserId($userId: Int!) {
      getInterviewedApplicantsByUserId(userId: $userId) {
        applicantRecordId
        interviewStatus
        applicantFirstName
        applicantLastName
      }
    }
`;

export const GET_INTERVIEWERS_BY_GROUP_ID = gql`
    query GetInterviewersByGroupId($groupId: ID!) {
      getInterviewersByGroupId(groupId: $groupId) {
        id
        firstName
        lastName
        email
        profilePictureFileId
      }
    }
`;