// shared/graphql/hooks/useMe.ts
"use client";

import { useQuery } from "@apollo/client/react";

// TODO: Implement Me query in GraphQL schema
// For now, this is a stub. The GraphQL schema doesn't have a Me query yet.
// Once implemented, import MeDocument from "../../generated/graphql"

export const useMeQuery = () => {
  // TODO: Return useQuery(MeDocument) once schema is implemented
  return {
    data: null,
    loading: false,
    error: new Error("Me query not yet implemented in GraphQL schema"),
  };
};
