// widgets/user-dataset/model/useUsersDatasetData.ts
"use client";

import { useMemo } from "react";

import { useUsersQuery, UseUsersQueryOptions } from "@/shared/graphql";

import type { UsersDatasetQuery } from "./types";

/**
 * Data layer - transforms query state to GraphQL variables and handles fetching
 * This is purely data plumbing
 */
export function useUsersDatasetData(query: UsersDatasetQuery) {
  // Transform query state to GraphQL variables
  const variables = useMemo<UseUsersQueryOptions>(() => {
    return {
      offset: query.offset,
      limit: query.limit,
      ...(query.sortBy && {
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      }),
      ...(query.search && {
        search: query.search,
      }),
      ...(query.status && {
        status: query.status,
      }),
      // Add filter fields to GraphQL variables
      ...(query.emailVerified !== undefined &&
        query.emailVerified !== null && {
          emailVerified: query.emailVerified,
        }),
      ...(query.createdAfter && {
        createdAfter: query.createdAfter,
      }),
      ...(query.createdBefore && {
        createdBefore: query.createdBefore,
      }),
    };
  }, [
    query.offset,
    query.limit,
    query.sortBy,
    query.sortOrder,
    query.search,
    query.status,
    query.emailVerified,
    query.createdAfter,
    query.createdBefore,
  ]);

  // Fetch data with transformed variables
  const { data, loading, error, refetch } = useUsersQuery(variables);

  // Extract useful data
  const users = data?.users?.items ?? [];
  const pageInfo = data?.users?.pageInfo;
  const totalPages = pageInfo ? Math.ceil(pageInfo.total / query.limit) : 0;

  return {
    users,
    pageInfo,
    totalPages,
    loading,
    error,
    refetch,
  };
}
