import { gql } from "@apollo/client";

export const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation loginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      id
      firstName
      lastName
      email
      role
      position
      accessToken
      refreshToken
    }
  }
`;

export const IS_AUTHORIZED_BY_ROLE_QUERY = gql`
  query isAuthorizedByRole($accessToken: String!, $roles: [Role!]!) {
    isAuthorizedByRole(accessToken: $accessToken, roles: $roles)
  }
`;