"use client";

import { useCallback, useMemo, useEffect } from "react";

import { UseFormReturn } from "react-hook-form";

import type { UsersDatasetQuery, UseUsersDatasetFiltersReturn } from "./types";

/**
 * Drawer Filters Hook
 *
 * Manages:
 * - Apply drawer filters (status, emailVerified, createdDate)
 * - Reset all filters
 * - Detect changes vs applied filters
 * - Track if any filters applied
 */

export function useUsersDatasetFilters(
  form: UseFormReturn<any>,
  query: UsersDatasetQuery,
  setQuery: (
    query: UsersDatasetQuery | ((prev: UsersDatasetQuery) => UsersDatasetQuery),
  ) => void,
  refetch?: (variables: any) => void,
): UseUsersDatasetFiltersReturn {
  // Watch all form values to detect changes
  const formValues = form.watch();

  /**
   * Detect if form values differ from applied query filters
   */
  const hasChanges = useMemo(() => {
    if (!formValues) return false;

    const formVal = (key: string) => formValues[key];
    const queryVal = (key: string) => {
      const queries: Record<string, any> = {
        status: query.status,
        emailVerified: query.emailVerified,
        createdDate: {
          from: query.createdAfter,
          to: query.createdBefore,
        },
      };
      return queries[key];
    };

    // Check each filter field
    if (formVal("status") !== queryVal("status")) return true;
    if (formVal("emailVerified") !== queryVal("emailVerified")) return true;

    const formDate = formVal("createdDate");
    const queryDate = queryVal("createdDate");
    if (formDate?.from !== queryDate?.from) return true;
    if (formDate?.to !== queryDate?.to) return true;

    return false;
  }, [formValues, query]);

  /**
   * Detect if any filters are currently applied
   */
  const hasAppliedFilters = useMemo(() => {
    return (
      query.status !== undefined ||
      query.emailVerified !== undefined ||
      query.createdAfter !== undefined ||
      query.createdBefore !== undefined
    );
  }, [query]);

  /**
   * Apply drawer filters to query
   * Updates status, emailVerified, createdAfter/createdBefore
   * Search is NOT updated here - managed by search hook
   */
  const onApplyFilters = useCallback(
    (values: any) => {
      setQuery((q: UsersDatasetQuery) => {
        const newQuery: UsersDatasetQuery = {
          ...q,
          offset: 0, // Reset to first page
          status: values.status || undefined,
          emailVerified: values.emailVerified ?? undefined,
          createdAfter: values.createdDate?.from || null,
          createdBefore: values.createdDate?.to || null,
          // NOTE: search is NOT updated - it's managed by search hook independently
        };
        // Trigger refetch
        refetch?.({ input: newQuery });
        return newQuery;
      });
    },
    [setQuery, refetch],
  );

  /**
   * Reset all filters and pagination
   */
  const onReset = useCallback(() => {
    setQuery((q: UsersDatasetQuery) => ({
      offset: 0,
      limit: 10,
      sortBy: null,
      sortOrder: "asc",
      search: q.search, // Keep search (it's managed separately)
      status: undefined,
      emailVerified: undefined,
      createdAfter: undefined,
      createdBefore: undefined,
    }));
    form.reset();
  }, [setQuery, form]);

  // Sync form with applied query filters when values change
  useEffect(() => {
    form.reset({
      search: query.search,
      status: query.status || undefined,
      emailVerified: query.emailVerified ?? undefined,
      createdDate: {
        from: query.createdAfter || undefined,
        to: query.createdBefore || undefined,
      },
    });
  }, [query, form]);

  return {
    onApplyFilters,
    onReset,
    hasChanges,
    hasAppliedFilters,
  };
}
