/**
 * Type definitions for User Dataset Model
 */

export interface UsersDatasetQuery {
  // Pagination
  offset: number;
  limit: number;
  // Sorting
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  // Filters
  search: string;
  status?: string;
  emailVerified?: boolean | null;
  createdAfter?: Date | null;
  createdBefore?: Date | null;
}

export interface DatasetStyleOptions {
  variant?: "compact" | "normal" | "spacious";
  theme?: "light" | "dark";
}

export interface UseUsersDatasetQueryReturn {
  query: UsersDatasetQuery;
  setQuery: (
    query: UsersDatasetQuery | ((prev: UsersDatasetQuery) => UsersDatasetQuery),
  ) => void;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (size: number) => void;
  onSort: (columnId: string) => void;
}

export interface UseUsersDatasetSearchReturn {
  onSearchChange: (value: string) => void;
}

export interface UseUsersDatasetFiltersReturn {
  onApplyFilters: (values: any) => void;
  onReset: () => void;
  hasChanges: boolean;
  hasAppliedFilters: boolean;
}

export interface UseDatasetStyleVariantReturn {
  styleOptions: DatasetStyleOptions;
  setStyleVariant: (variant: "compact" | "normal" | "spacious") => void;
  setTheme: (theme: "light" | "dark") => void;
}
