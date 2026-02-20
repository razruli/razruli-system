// shared/ui/table/use-base-columns.ts
import { ColumnDef } from "@tanstack/react-table";

import { BaseColumn, WithBaseColumns } from "../types";

export function useBaseColumns<T>(
  include?: BaseColumn[],
): ColumnDef<WithBaseColumns<T>>[] {
  const allBaseColumns: Record<BaseColumn, ColumnDef<WithBaseColumns<T>>> = {
    [BaseColumn.ID]: {
      accessorKey: "id",
      header: "ID",
    },
    [BaseColumn.CREATED_AT]: {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
    },
    [BaseColumn.STATUS]: {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (getValue<string>() ? getValue() : "-"),
    },
  };

  if (!include || include.length === 0) return [];

  return include.map((key) => allBaseColumns[key]);
}
