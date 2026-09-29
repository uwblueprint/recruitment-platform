import { ApolloLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { refreshAccessToken } from "./refreshAccessToken";

export function createAuthLink(
  refresh: Parameters<typeof refreshAccessToken>[0]
) {
  const authenticate = setContext(async (_, { headers, refreshAuth }) => {
    if (refreshAuth) await refreshAccessToken(refresh);
    const accessToken = localStorage.getItem("accessToken");
    return {
      accessToken,
      headers: {
        ...headers,
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
    };
  });

  const applyTokenVariable = new ApolloLink((operation, forward) => {
    const { useAccessTokenVariable, accessToken } = operation.getContext();
    if (useAccessTokenVariable) {
      // Authorization also takes a token argument. Use the same refreshed token
      // as the header, without mutating the hook's original variables object.
      operation.variables = { ...operation.variables, accessToken };
    }
    return forward(operation);
  });

  return from([authenticate, applyTokenVariable]);
}
