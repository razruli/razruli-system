// shared/ui/table/use-entity-columns.ts
import { ColumnDef } from "@tanstack/react-table";

import { BaseColumn, WithBaseColumns } from "../types";

import { useBaseColumns } from "./useBaseColumns";

type UseEntityColumnsProps<T> = {
  includeBase?: BaseColumn[];
  entityColumns: ColumnDef<WithBaseColumns<T>>[];
};

export function useEntityColumns<T>({
  includeBase,
  entityColumns,
}: UseEntityColumnsProps<T>): { columns: ColumnDef<WithBaseColumns<T>>[] } {
  const baseCols = useBaseColumns<T>(includeBase);
  return { columns: [...baseCols, ...entityColumns] };
}
