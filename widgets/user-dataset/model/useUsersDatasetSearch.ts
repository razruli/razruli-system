"use client";

import { useCallback, useRef, useEffect } from "react";

import { UseFormReturn } from "react-hook-form";

import type { UsersDatasetQuery, UseUsersDatasetSearchReturn } from "./types";

/**
 * Search Debounce Hook
 *
 * Manages:
 * - Form search field (immediate visual feedback)
 * - Query search sync (debounced refetch)
 *
 * Pattern:
 * User types → form.setValue → form.watch triggers
 *   → debounce 300ms → query updates → refetch
 *
 * User sees changes immediately in search box,
 * but data fetching is debounced to prevent spam
 */

interface UseUsersDatasetSearchOptions {
  debounceMs?: number;
}

export function useUsersDatasetSearch(
  form: UseFormReturn<any>,
  query: UsersDatasetQuery,
  setQuery: (
    query: UsersDatasetQuery | ((prev: UsersDatasetQuery) => UsersDatasetQuery),
  ) => void,
  refetch?: (variables: any) => void,
  options?: UseUsersDatasetSearchOptions,
): UseUsersDatasetSearchReturn {
  const debounceMs = options?.debounceMs ?? 300;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Watch form search field and debounce query update
   */
  useEffect(() => {
    // Clear previous debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Get current form search value
    const searchValue = form.getValues("search") || "";

    // Debounce the query update
    debounceTimerRef.current = setTimeout(() => {
      setQuery((q: UsersDatasetQuery) => {
        // Only update if search actually changed
        if (q.search !== searchValue) {
          const newQuery = {
            ...q,
            offset: 0, // Reset to first page on new search
            search: searchValue,
          };
          // Trigger refetch
          refetch?.({ input: newQuery });
          return newQuery;
        }
        return q;
      });
    }, debounceMs);

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [setQuery, refetch, debounceMs, form]);

  /**
   * Search change handler - just update form field
   * Debounce effect above handles query sync
   */
  const onSearchChange = useCallback(
    (value: string) => {
      form.setValue("search", value);
    },
    [form],
  );

  return {
    onSearchChange,
  };
}
