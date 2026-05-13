import { gql } from "@apollo/client";

export const REFRESH_MUTATION = gql`
  mutation refresh($refreshToken: String!) {
    refresh(refreshToken: $refreshToken)
  }
`;
