"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { GRAPH_API_URL } from "./wagmi";

const httpLink = new HttpLink({
  uri: GRAPH_API_URL,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
