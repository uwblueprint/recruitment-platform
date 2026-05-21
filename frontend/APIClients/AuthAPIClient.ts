import { client } from "@/client";
import type { AuthResult } from "@/types";
import type { Role as AppRole } from "@/types";
import {
  IsAuthorizedByRoleDocument,
  LoginWithGoogleDocument,
  Role,
  type IsAuthorizedByRoleQuery,
  type IsAuthorizedByRoleQueryVariables,
  type LoginWithGoogleMutation,
  type LoginWithGoogleMutationVariables,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class AuthAPIClient {
  static async isAuthorizedByRole(allowedRoles: AppRole[]): Promise<boolean> {
    await BaseAPIClient.handleAuthRefresh();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token provided");
    }

    try {
      const { data } = await client.query<
        IsAuthorizedByRoleQuery,
        IsAuthorizedByRoleQueryVariables
      >({
        query: IsAuthorizedByRoleDocument,
        variables: {
          accessToken,
          roles: allowedRoles as Role[],
        },
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
        LoginWithGoogleMutation,
        LoginWithGoogleMutationVariables
      >({
        mutation: LoginWithGoogleDocument,
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
