// feature/user/table/rows/useUserRowSelection.ts
"use client";

import { useState, useCallback } from "react";

/**
 * Selection state and handlers
 */
export interface UseUserRowSelectionResult {
  selectedIds: Set<string>;
  isRowSelected: (id: string) => boolean;
  selectedCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;

  // Handlers
  toggleRowSelection: (id: string) => void;
  toggleAllSelection: (rows: { id: string }[]) => void;
  clearSelection: () => void;
}

/**
 * Hook for managing row selection state
 * Provides selection state and handlers for controlled selection
 */
export function useUserRowSelection(): UseUserRowSelectionResult {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isRowSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAllSelection = useCallback((rows: { id: string }[]) => {
    setSelectedIds((prev) => {
      const allSelected = rows.every((row) => prev.has(row.id));

      if (allSelected) {
        // Deselect all
        return new Set();
      } else {
        // Select all
        return new Set(rows.map((row) => row.id));
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    isRowSelected,
    selectedCount: selectedIds.size,
    isAllSelected: selectedIds.size > 0 && selectedIds.size > 0, // Will be properly set with rows context
    isIndeterminate: selectedIds.size > 0,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
  };
}
