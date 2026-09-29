import { createAuthLink } from "@/APIClients/createAuthLink";
import { RefreshDocument } from "@/graphql/typeUtils";
import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { ApolloLink } from "@apollo/client/link";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const uploadLink = new UploadHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  headers: { "Apollo-Require-Preflight": "true" },
}) as unknown as ApolloLink;

const authLink = createAuthLink(async (refreshToken) => {
  // The refresh mutation does not opt in, so it cannot recurse here.
  const { data } = await client.mutate({
    mutation: RefreshDocument,
    variables: { refreshToken },
  });
  return data?.refresh;
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, uploadLink]),
});
