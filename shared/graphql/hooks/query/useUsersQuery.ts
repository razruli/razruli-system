// shared/graphql/hooks/query/useUsersQuery.ts
"use client";

// TODO: Implement Users query in GraphQL schema
// This hook needs the Users query to be added to the GraphQL schema

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
  // TODO: Implement once Users query is added to GraphQL schema
  return {
    data: { users: [] },
    loading: false,
    error: new Error("Users query not yet implemented in GraphQL schema"),
  };
};
