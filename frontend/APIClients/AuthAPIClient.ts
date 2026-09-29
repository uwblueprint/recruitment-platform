import { client } from "@/client";
import type { Role as AppRole } from "@/types";
import {
  IsAuthorizedByRoleDocument,
  Role,
  type IsAuthorizedByRoleQuery,
  type IsAuthorizedByRoleQueryVariables,
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
    } catch (e) {
      console.error("isAuthorizedByRole failed:", e);
      const detail = e instanceof Error ? e.message : String(e);
      throw new Error(`Auth Validation Error: ${detail}`);
    }
  }
}

export default AuthAPIClient;
