import { client } from "@/client";
import { mutations, queries } from "@/graphql/queries";
import type { AuthResult, Role } from "@/types";
import { gql } from "@apollo/client";

import BaseAPIClient from "./BaseAPIClient";

type IsAuthorizedByRoleData = {
  isAuthorizedByRole: boolean;
};

type LoginWithGoogleMutationData = {
  loginWithGoogle: AuthResult;
};

class AuthAPIClient {
  static async isAuthorizedByRole(allowedRoles: Role[]): Promise<boolean> {
    await BaseAPIClient.handleAuthRefresh();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token provided");
    }

    try {
      const { data } = await client.query<
        IsAuthorizedByRoleData,
        { accessToken: string; roles: Role[] }
      >({
        query: gql(queries.isAuthorizedByRole),
        variables: { accessToken, roles: allowedRoles },
        fetchPolicy: "network-only",
      });

      return Boolean(data?.isAuthorizedByRole);
    } catch {
      throw new Error("Auth Validation Error");
    }
  }

  static async loginWithGoogle(idToken: string): Promise<AuthResult> {
    try {
      const { data } = await client.mutate<
        LoginWithGoogleMutationData,
        { idToken: string }
      >({
        mutation: gql(mutations.loginWithGoogle),
        variables: { idToken },
      });

      const loginData = data?.loginWithGoogle;
      if (!loginData) {
        throw new Error("Login Error");
      }

      return {
        id: loginData.id,
        firstName: loginData.firstName,
        lastName: loginData.lastName,
        email: loginData.email,
        role: loginData.role,
        position: loginData.position,
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
      };
    } catch {
      throw new Error("Login Error");
    }
  }
}

export default AuthAPIClient;
