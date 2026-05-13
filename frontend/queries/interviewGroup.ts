import { gql } from "@apollo/client";

export const UPDATE_INTERVIEW_GROUP_MUTATION = gql`
    mutation UpdateInterviewGroup($id: ID!, $interviewGroup: UpdateInterviewGroupDTO!) {
      updateInterviewGroup(id: $id, interviewGroup: $interviewGroup) {
        schedulingLink
        status
      }
    }
`;

export const GET_INTERVIEW_GROUP_BY_ID_QUERY = gql`
    query GetInterviewGroupById($id: ID!) {
      getInterviewGroupById(id: $id) {
        schedulingLink
        status
      }
    }
`;
