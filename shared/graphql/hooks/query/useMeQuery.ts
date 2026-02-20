// shared/graphql/hooks/useMe.ts
"use client";

import { useQuery } from "@apollo/client/react";

import { MeDocument } from "../../generated/graphql";

export const useMeQuery = () => {
  return useQuery(MeDocument);
};
