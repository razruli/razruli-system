"use client";

import { useState, useCallback } from "react";

import type { UsersDatasetQuery, UseUsersDatasetQueryReturn } from "./types";

/**
 * Query State Hook - Pagination & Sorting
 *
 * Manages:
 * - Offset/limit (pagination)
 * - SortBy/sortOrder (sorting)
 * - Search field (synced with debounce hook)
 *
 * This is the SOURCE OF TRUTH for data fetching parameters
 */

const INITIAL_QUERY: UsersDatasetQuery = {
  offset: 0,
  limit: 10,
  sortBy: null,
  sortOrder: "asc",
  search: "",
  status: undefined,
  emailVerified: undefined,
  createdAfter: undefined,
  createdBefore: undefined,
};

interface UseUsersDatasetQueryOptions {
  initialQuery?: Partial<UsersDatasetQuery>;
}

export function useUsersDatasetQuery(
  options?: UseUsersDatasetQueryOptions,
): UseUsersDatasetQueryReturn {
  const [query, setQuery] = useState<UsersDatasetQuery>({
    ...INITIAL_QUERY,
    ...options?.initialQuery,
  });

  /**
   * Change page
   */
  const onPageChange = useCallback((pageIndex: number) => {
    setQuery((q) => ({
      ...q,
      offset: pageIndex * q.limit,
    }));
  }, []);

  /**
   * Change page size, reset to first page
   */
  const onPageSizeChange = useCallback((size: number) => {
    setQuery((q) => ({
      ...q,
      limit: size,
      offset: 0, // Reset to first page
    }));
  }, []);

  /**
   * Change sort column/direction
   * If clicking same column, toggle direction
   */
  const onSort = useCallback((columnId: string) => {
    setQuery((q) => ({
      ...q,
      offset: 0, // Reset to first page
      sortBy: columnId,
      sortOrder:
        q.sortBy === columnId && q.sortOrder === "asc" ? "desc" : "asc",
    }));
  }, []);

  return {
    query,
    setQuery,
    onPageChange,
    onPageSizeChange,
    onSort,
  } as UseUsersDatasetQueryReturn;
}
