// shared/graphql/hooks/query/useUsersQuery.ts
"use client";

import { useQuery } from "@apollo/client/react";

import { UsersDocument } from "../../generated/graphql";

export interface UseUsersQueryOptions {
  offset?: number;
  limit?: number;
  sortBy?: string | null;
  sortOrder?: string;
  search?: string;
  status?: string;
  emailVerified?: boolean | null;
  createdAfter?: Date | null;
  createdBefore?: Date | null;
  skip?: boolean;
}

export const useUsersQuery = (options: UseUsersQueryOptions = {}) => {
  const {
    offset = 0,
    limit = 10,
    sortBy,
    sortOrder,
    search,
    status,
    emailVerified,
    createdAfter,
    createdBefore,
    skip = false,
  } = options;

  return useQuery(UsersDocument, {
    variables: {
      input: {
        offset,
        limit,
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(search && { search }),
        ...(status && { status }),
        ...(emailVerified && { emailVerified }),
        ...(createdAfter && { createdAfter: createdAfter }),
        ...(createdBefore && { createdBefore: createdBefore }),
      },
    },
    skip,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
  });
};
