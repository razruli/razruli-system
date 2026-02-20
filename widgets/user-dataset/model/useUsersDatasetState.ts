// widgets/user-dataset/model/useUsersDatasetState.ts
"use client";

import { useState, useCallback } from "react";

export interface UsersDatasetState {
  offset: number;
  limit: number;
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  search: string;
  status?: string;
}

/**
 * Server-driven dataset state management
 * Single source of truth for all dataset operations
 */
export function useUsersDatasetState(
  initialFilters?: Partial<UsersDatasetState>,
) {
  const [state, setState] = useState<UsersDatasetState>({
    offset: 0,
    limit: 10,
    sortBy: null,
    sortOrder: "asc",
    search: "",
    status: undefined,
    ...initialFilters,
  });

  /**
   * Handle pagination changes
   * Resets to first page when filters/sorting change
   */
  const setPagination = useCallback((offset: number, limit: number) => {
    setState((prev) => ({
      ...prev,
      offset,
      limit,
    }));
  }, []);

  /**
   * Handle sorting
   * Toggles direction if same column clicked
   * Resets to page 1
   */
  const setSort = useCallback((sortBy: string | null) => {
    setState((prev) => ({
      ...prev,
      offset: 0, // Reset to first page
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  }, []);

  /**
   * Handle filtering
   * Resets to page 1 when filters change
   */
  const setFilters = useCallback((filters: Partial<UsersDatasetState>) => {
    setState((prev) => ({
      ...prev,
      offset: 0, // Reset to first page
      ...filters,
    }));
  }, []);

  /**
   * Reset all filters and return to first page
   */
  const reset = useCallback(() => {
    setState({
      offset: 0,
      limit: 10,
      sortBy: null,
      sortOrder: "asc",
      search: "",
      status: undefined,
    });
  }, []);

  return {
    state,
    setPagination,
    setSort,
    setFilters,
    reset,
  };
}
