export const mutations = {
  refresh: `
    mutation refresh($refreshToken: String!) {
      refresh(refreshToken: $refreshToken)
    }
  `,
  loginWithGoogle: `mutation loginWithGoogle($idToken: String!) {
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
  }`,
};

export const queries = {
  isAuthorizedByRole: `
  query isAuthorizedByRole($accessToken: String!, $roles: [Role!]!) {
      isAuthorizedByRole(accessToken: $accessToken, roles: $roles)
  }
  `,
};
