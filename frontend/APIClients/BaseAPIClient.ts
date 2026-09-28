import { client } from "@/client";
import { refreshAccessToken } from "./refreshAccessToken";
import {
  RefreshDocument,
  type RefreshMutation,
  type RefreshMutationVariables,
} from "@/graphql/typeUtils";

class BaseAPIClient {
  static async handleAuthRefresh(): Promise<void> {
    return refreshAccessToken(async (refreshToken) => {
      const { data } = await client.mutate<
        RefreshMutation,
        RefreshMutationVariables
      >({
        mutation: RefreshDocument,
        variables: { refreshToken },
      });
      return data?.refresh;
    });
  }
}

export default BaseAPIClient;
