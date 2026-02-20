"use client";

import { useState, useCallback } from "react";

/**
 * Table Column Visibility Hook - REUSABLE
 *
 * Manages:
 * - Column visibility toggling
 * - Show all / hide all
 *
 * Generic hook - works for ANY table, not user-specific
 * Lives in shared/lib because it's reusable
 */

interface UseTableColumnVisibilityOptions {
  initialVisibility?: Record<string, boolean>;
}

interface UseTableColumnVisibilityReturn {
  columnVisibility: Record<string, boolean>;
  toggleColumn: (columnId: string) => void;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  showAll: () => void;
  hideAll: () => void;
}

export function useTableColumnVisibility(
  options?: UseTableColumnVisibilityOptions,
): UseTableColumnVisibilityReturn {
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(options?.initialVisibility ?? {});

  /**
   * Toggle single column visibility
   */
  const toggleColumn = useCallback((columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, []);

  /**
   * Set entire visibility map
   */
  const setVisibility = useCallback((visibility: Record<string, boolean>) => {
    setColumnVisibility(visibility);
  }, []);

  /**
   * Show all columns
   */
  const showAll = useCallback(() => {
    setColumnVisibility((prev) => {
      const allVisible: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        allVisible[key] = true;
      });
      return allVisible;
    });
  }, []);

  /**
   * Hide all columns
   */
  const hideAll = useCallback(() => {
    setColumnVisibility((prev) => {
      const allHidden: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        allHidden[key] = false;
      });
      return allHidden;
    });
  }, []);

  return {
    columnVisibility,
    toggleColumn,
    setColumnVisibility: setVisibility,
    showAll,
    hideAll,
  };
}
