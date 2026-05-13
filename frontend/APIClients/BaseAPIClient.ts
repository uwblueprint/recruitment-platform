import { client } from "@/client";
import jwt_decode from "jwt-decode";
import { REFRESH_MUTATION } from "@/queries/base";

type AccessToken = {
  readonly exp: number;
};

type RefreshMutationData = {
  refresh: string;
};

class BaseAPIClient {
  static async handleAuthRefresh(): Promise<void> {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      throw new Error("No access or refresh token provided");
    }

    const decodedToken = jwt_decode<AccessToken>(accessToken);
    const nowSec = Math.round(Date.now() / 1000);
    if (!decodedToken || decodedToken.exp > nowSec) {
      return;
    }

    try {
      const { data } = await client.mutate<
        RefreshMutationData,
        { refreshToken: string }
      >({
        mutation: REFRESH_MUTATION,
        variables: { refreshToken },
      });
      if (typeof data?.refresh === "string") {
        localStorage.setItem("accessToken", data.refresh);
      }
    } catch (e) {
      localStorage.clear();
      window.location.reload();
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(
        `Failed to refresh accessToken token. Cause: ${message}`,
      );
    }
  }
}

export default BaseAPIClient;
