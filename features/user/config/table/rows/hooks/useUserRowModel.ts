// feature/user/table/rows/useUserRowModel.ts
"use client";

import { useCallback, useMemo } from "react";

import { UserTableRow } from "@/entities/user";

import {
  useUserRowExpansion,
  UseUserRowExpansionOptions,
} from "./useUserRowExpansion";
import { useUserRowSelection } from "./useUserRowSelection";

/**
 * Complete row model orchestrating selection and expansion
 */
export interface UseUserRowModelResult {
  // Selection
  selectedIds: Set<string>;
  selectedCount: number;
  isRowSelected: (id: string) => boolean;
  toggleRowSelection: (id: string) => void;
  toggleAllSelection: (rows: UserTableRow[]) => void;
  clearSelection: () => void;

  // Expansion
  expandedIds: Set<string>;
  expandedCount: number;
  isRowExpanded: (id: string) => boolean;
  toggleRowExpansion: (id: string) => void;
  expandRow: (id: string) => void;
  collapseRow: (id: string) => void;
  collapseAll: () => void;
  expandAll: (rowIds: string[]) => void;

  // Batch helpers
  selectRows: (rows: UserTableRow[]) => void;
  deselectRows: (rows: UserTableRow[]) => void;
}

/**
 * Orchestrates row selection and expansion state
 * Manages both behaviors together for convenient widget integration
 */
export function useUserRowModel(
  expansionOptions?: UseUserRowExpansionOptions,
): UseUserRowModelResult {
  const selection = useUserRowSelection();
  const expansion = useUserRowExpansion(expansionOptions);

  // Batch helpers
  const selectRows = useCallback(
    (rows: UserTableRow[]) => {
      rows.forEach((row) => {
        if (!selection.isRowSelected(row.id)) {
          selection.toggleRowSelection(row.id);
        }
      });
    },
    [selection],
  );

  const deselectRows = useCallback(
    (rows: UserTableRow[]) => {
      rows.forEach((row) => {
        if (selection.isRowSelected(row.id)) {
          selection.toggleRowSelection(row.id);
        }
      });
    },
    [selection],
  );

  return useMemo(
    () => ({
      // Selection
      selectedIds: selection.selectedIds,
      selectedCount: selection.selectedCount,
      isRowSelected: selection.isRowSelected,
      toggleRowSelection: selection.toggleRowSelection,
      toggleAllSelection: selection.toggleAllSelection,
      clearSelection: selection.clearSelection,

      // Expansion
      expandedIds: expansion.expandedIds,
      expandedCount: expansion.expandedCount,
      isRowExpanded: expansion.isRowExpanded,
      toggleRowExpansion: expansion.toggleRowExpansion,
      expandRow: expansion.expandRow,
      collapseRow: expansion.collapseRow,
      collapseAll: expansion.collapseAll,
      expandAll: expansion.expandAll,

      // Batch helpers
      selectRows,
      deselectRows,
    }),
    [
      selection.selectedIds,
      selection.selectedCount,
      selection.isRowSelected,
      selection.toggleRowSelection,
      selection.toggleAllSelection,
      selection.clearSelection,
      expansion.expandedIds,
      expansion.expandedCount,
      expansion.isRowExpanded,
      expansion.toggleRowExpansion,
      expansion.expandRow,
      expansion.collapseRow,
      expansion.collapseAll,
      expansion.expandAll,
      selectRows,
      deselectRows,
    ],
  );
}
