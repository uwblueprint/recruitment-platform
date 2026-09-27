import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { ApolloLink } from "@apollo/client/link";
import { setContext } from "@apollo/client/link/context";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const uploadLink = new UploadHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  headers: { "Apollo-Require-Preflight": "true" },
}) as unknown as ApolloLink;

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, uploadLink]),
});
