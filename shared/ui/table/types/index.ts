// shared/ui/table/types.ts
import {
  SortingState,
  PaginationState,
  RowSelectionState,
  ColumnFiltersState,
  OnChangeFn,
} from "@tanstack/react-table";

export type TableState = {
  sorting?: SortingState;
  pagination?: PaginationState;
  rowSelection?: RowSelectionState;
  columnFilters?: ColumnFiltersState;
};

export type TableHandlers = {
  onSortingChange?: OnChangeFn<SortingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
};

export type TableFeatures = {
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableFiltering?: boolean;

  manualSorting?: boolean;
  manualPagination?: boolean;
  manualFiltering?: boolean;

  pageCount?: number;
};
