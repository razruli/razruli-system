import { useState } from "react";

import {
  SortingState,
  PaginationState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";

type UseTableParams = {
  initialPageSize?: number;
};

export function useTanstackTable(params?: UseTableParams) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: params?.initialPageSize ?? 20,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return {
    state: {
      sorting,
      pagination,
      columnFilters,
      rowSelection,
    },

    handlers: {
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
      onColumnFiltersChange: setColumnFilters,
      onRowSelectionChange: setRowSelection,
    },
  };
}
