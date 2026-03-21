import { HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { cookies } from "next/headers";

export const { getClient, query, PreloadQuery } = registerApolloClient(
  async () => {
    // Create context link to inject cookies into headers
    // Must be called outside the SetContextLink callback since cookies() is async
    const cookie = await cookies();
    const cookieString = cookie.toString();

    const contextLink = new SetContextLink((prevContext, _operation) => {
      return {
        headers: {
          ...prevContext.headers,
          cookie: cookieString,
        },
      };
    });

    // Create HTTP link for GraphQL endpoint
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_BASE_URL + "/api/graphql",
      credentials: "same-origin", // include cookies for authentication
      fetchOptions: {
        cache: "no-store", // disable caching to ensure fresh data on every request
        // you can pass additional options that should be passed to `fetch` here,
        // e.g. Next.js-related `fetch` options regarding caching and revalidation
        // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
      },
    });

    // Concatenate context link with HTTP link
    const link = contextLink.concat(httpLink);

    return new ApolloClient({
      cache: new InMemoryCache(),
      link,
    });
  },
);
