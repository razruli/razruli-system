// feature/user/table/rows/useUserRowExpansion.ts
"use client";

import { useState, useCallback } from "react";

/**
 * Expansion options for accordion behavior
 */
export interface UseUserRowExpansionOptions {
  /**
   * Only allow one row to be expanded at a time
   * Default: false (allow multiple)
   */
  singleOpen?: boolean;
}

/**
 * Expansion state and handlers
 */
export interface UseUserRowExpansionResult {
  expandedIds: Set<string>;
  isRowExpanded: (id: string) => boolean;
  expandedCount: number;

  // Handlers
  toggleRowExpansion: (id: string) => void;
  expandRow: (id: string) => void;
  collapseRow: (id: string) => void;
  collapseAll: () => void;
  expandAll: (rowIds: string[]) => void;
}

/**
 * Hook for managing row expansion state
 * Supports accordion behavior (singleOpen) and multi-expand modes
 * Used for custom expansion types (modal, panel, popover)
 * For TanStack accordion, use getExpandedRowModel() instead
 */
export function useUserRowExpansion(
  options: UseUserRowExpansionOptions = {},
): UseUserRowExpansionResult {
  const { singleOpen = false } = options;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const isRowExpanded = useCallback(
    (id: string) => expandedIds.has(id),
    [expandedIds],
  );

  const toggleRowExpansion = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);

        if (next.has(id)) {
          // Collapsing
          next.delete(id);
        } else {
          // Expanding
          if (singleOpen) {
            // Clear all others
            next.clear();
          }
          next.add(id);
        }

        return next;
      });
    },
    [singleOpen],
  );

  const expandRow = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (singleOpen) {
          next.clear();
        }
        next.add(id);
        return next;
      });
    },
    [singleOpen],
  );

  const collapseRow = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const expandAll = useCallback(
    (rowIds: string[]) => {
      if (singleOpen) {
        // Only expand first
        setExpandedIds(new Set(rowIds.slice(0, 1)));
      } else {
        setExpandedIds(new Set(rowIds));
      }
    },
    [singleOpen],
  );

  return {
    expandedIds,
    isRowExpanded,
    expandedCount: expandedIds.size,
    toggleRowExpansion,
    expandRow,
    collapseRow,
    collapseAll,
    expandAll,
  };
}
