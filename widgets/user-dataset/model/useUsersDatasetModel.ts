"use client";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

import { mapUsersToRows, userRowConfig } from "@/entities/user";
import {
  useUserDatasetFilterForm,
  useUserDatasetColumns,
  useUserRowModel,
} from "@/features/user";
import { useTableColumnVisibility } from "@/shared/lib/hooks";

import { useDatasetStyleVariant } from "./useDatasetStyleVariant";
import { useUsersDatasetData } from "./useUsersDatasetData";
// Import individual hooks
import { useUsersDatasetFilters } from "./useUsersDatasetFilters";
import { useUsersDatasetQuery } from "./useUsersDatasetQuery";
import { useUsersDatasetSearch } from "./useUsersDatasetSearch";

/**
 * ORCHESTRATOR HOOK - User Dataset Model
 *
 * Composes all individual hooks:
 * - Query (pagination, sorting)
 * - Search (debounced)
 * - Filters (drawer)
 * - Style (variant, theme)
 * - Column Visibility (generic)
 * - Form (drawer filter inputs)
 * - Data fetching
 * - Table setup
 *
 * Philosophy:
 * - Minimal logic here (just hook composition + synchronization)
 * - Each concern lives in its own hook
 * - Easy to test, understand, and extend
 */

interface UseUsersDatasetModelOptions {
  initialQuery?: any;
  initialStyle?: any;
  initialColumnVisibility?: Record<string, boolean>;
}

export function useUsersDatasetModel(options?: UseUsersDatasetModelOptions) {
  // ============================================================================
  // 1. INDIVIDUAL HOOKS - Each handles one concern
  // ============================================================================

  // Query state (pagination, sorting, search field)
  const queryHook = useUsersDatasetQuery({
    initialQuery: options?.initialQuery,
  });

  // Form for drawer filters
  const form = useUserDatasetFilterForm();

  // Data fetching driven by query
  const { users, pageInfo, totalPages, loading, error, refetch } =
    useUsersDatasetData(queryHook.query);

  // Debounced search synchronization
  const searchHook = useUsersDatasetSearch(
    form,
    queryHook.query,
    queryHook.setQuery,
    refetch,
  );

  // Drawer filters (status, emailVerified, createdDate)
  const filtersHook = useUsersDatasetFilters(
    form,
    queryHook.query,
    queryHook.setQuery,
    refetch,
  );

  // Widget styling (variant, theme)
  const styleHook = useDatasetStyleVariant({
    initialStyle: options?.initialStyle,
  });

  // Column visibility (reusable generic hook)
  const columnsHook = useTableColumnVisibility({
    initialVisibility: options?.initialColumnVisibility,
  });

  // ============================================================================
  // 2. TABLE SETUP
  // ============================================================================

  const { columns } = useUserDatasetColumns();
  const rowModel = useUserRowModel({
    singleOpen: userRowConfig.singleExpandOpen,
  });

  const data = mapUsersToRows(users);
  const table = useReactTable({
    data,
    columns,
    rowCount: pageInfo?.total ?? 0,
    getCoreRowModel: getCoreRowModel(),
  });

  const currentPage =
    Math.floor(queryHook.query.offset / queryHook.query.limit) + 1;

  // ============================================================================
  // 3. RETURN CONSOLIDATED API
  // ============================================================================

  return {
    // Query & Pagination
    query: queryHook.query,
    setQuery: queryHook.setQuery,
    onPageChange: queryHook.onPageChange,
    onPageSizeChange: queryHook.onPageSizeChange,
    onSort: queryHook.onSort,
    currentPage,

    // Search
    onSearchChange: searchHook.onSearchChange,

    // Filters (Drawer)
    form,
    onApplyFilters: filtersHook.onApplyFilters,
    onReset: filtersHook.onReset,
    hasChanges: filtersHook.hasChanges,
    hasAppliedFilters: filtersHook.hasAppliedFilters,

    // Styling
    styleOptions: styleHook.styleOptions,
    setStyleVariant: styleHook.setStyleVariant,
    setTheme: styleHook.setTheme,

    // Column Visibility
    columnVisibility: columnsHook.columnVisibility,
    toggleColumn: columnsHook.toggleColumn,
    setColumnVisibility: columnsHook.setColumnVisibility,
    showAllColumns: columnsHook.showAll,
    hideAllColumns: columnsHook.hideAll,

    // Refresh
    onRefresh: () => refetch?.({ input: queryHook.query }),

    // Table & Data
    table,
    columns,
    users,
    pageInfo,
    totalPages,
    loading,
    error,

    // Row behavior
    rowModel,
    rowConfig: userRowConfig,
  };
}
