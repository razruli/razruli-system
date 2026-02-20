// widgets/user-dataset/ui/UserDatasetView.tsx
"use client";

import { useMemo } from "react";

import { ErrorLike } from "@apollo/client";
import { Eye, EyeOff, Palette } from "lucide-react";

import { UserDatasetFilterValues } from "@/entities/user";
import { UserDatasetFiltersUI } from "@/features/user";
import {
  Table,
  TanstackTableHeader,
  TanstackTableBody,
  DataTablePagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

interface UsersDatasetViewProps {
  // From model
  table: any;
  form: any;
  users: any[];
  pageInfo: any;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error?: ErrorLike;
  query: any;

  // Handlers from model
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onApplyFilters: (filters: UserDatasetFilterValues) => void;
  onSearchChange: (searchValue: string) => void;
  onRefresh: () => void;
  onReset: () => void;

  // Style handlers
  styleOptions?: { variant?: string; theme?: string };
  setStyleVariant?: (variant: "compact" | "normal" | "spacious") => void;
  setTheme?: (theme: "light" | "dark") => void;

  // Column visibility
  columnVisibility?: Record<string, boolean>;
  toggleColumn?: (columnId: string) => void;
  showAllColumns?: () => void;
  hideAllColumns?: () => void;

  // Feature flags - control what renders
  showRowFilters?: boolean;
  showPagination?: boolean;
  // Filter visibility: array of filter field IDs to show, undefined = all, empty array = none
  filters?: string[];
}

/**
 * Users Dataset View - PURE PRESENTATION
 *
 * Completely dumb component that receives everything from model.
 * No form creation, no state management, no handlers - just renders.
 *
 * Every prop comes from the dataset model, which is the single source of truth.
 */
export function UsersDatasetView({
  table,
  form,
  users,
  pageInfo,
  totalPages,
  currentPage,
  loading,
  error,
  query,
  onPageChange,
  onPageSizeChange,
  onApplyFilters,
  onSearchChange,
  onRefresh,
  onReset,
  styleOptions,
  setStyleVariant,
  setTheme,
  columnVisibility,
  toggleColumn,
  showAllColumns,
  hideAllColumns,
  showRowFilters = true,
  showPagination = true,
  filters,
}: UsersDatasetViewProps) {
  const isEmpty = users.length === 0;

  // Calculate active filter count from query
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query.search) count++;
    if (
      query.status !== undefined &&
      query.status !== null &&
      query.status !== ""
    )
      count++;
    return count;
  }, [query.search, query.status]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to Load Users
          </h3>
          <p className="text-red-700 text-sm mb-4">{error.message}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Total: {pageInfo?.total ?? 0}
          </span>
          {loading && (
            <div className="animate-spin">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Filters UI */}
      <div className="space-y-4">
        {/* Style & Column Controls */}
        {(styleOptions || columnVisibility) && (
          <div className="flex items-center gap-2 pb-4 border-b flex-wrap">
            {/* Style Variant Selector */}
            {styleOptions && setStyleVariant && (
              <Select
                value={styleOptions.variant || "normal"}
                onValueChange={setStyleVariant}
              >
                <SelectTrigger className="w-32">
                  <Palette className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Theme Selector */}
            {styleOptions && setTheme && (
              <Select
                value={styleOptions.theme || "light"}
                onValueChange={setTheme}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Column Visibility Menu */}
            {columnVisibility && toggleColumn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Toggle individual columns */}
                  {Object.entries(columnVisibility).map(
                    ([columnId, isVisible]) => (
                      <DropdownMenuItem
                        key={columnId}
                        onClick={() => toggleColumn(columnId)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 w-full">
                          {isVisible ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="capitalize">{columnId}</span>
                        </div>
                      </DropdownMenuItem>
                    ),
                  )}
                  <div className="my-2 border-t" />
                  {/* Bulk actions */}
                  {showAllColumns && (
                    <DropdownMenuItem
                      onClick={showAllColumns}
                      className="cursor-pointer text-xs"
                    >
                      Show All
                    </DropdownMenuItem>
                  )}
                  {hideAllColumns && (
                    <DropdownMenuItem
                      onClick={hideAllColumns}
                      className="cursor-pointer text-xs"
                    >
                      Hide All
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Filters UI */}
        {showRowFilters && (
          <UserDatasetFiltersUI
            form={form}
            appliedFilters={query}
            activeFilterCount={activeFilterCount}
            onApply={onApplyFilters}
            onReset={onReset}
            onSearchChange={onSearchChange}
            filters={filters}
          />
        )}
      </div>

      {/* Empty State */}
      {isEmpty && !loading && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No users found</p>
            <button
              onClick={onReset}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {!isEmpty && (
        <div className="border rounded-lg overflow-hidden">
          <div className={loading ? "opacity-60 pointer-events-none" : ""}>
            <Table>
              <TanstackTableHeader table={table} />
              <TanstackTableBody table={table} />
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={query.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          loading={loading}
        />
      )}
    </section>
  );
}
