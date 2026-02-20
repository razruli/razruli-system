"use client";

import { useState, useCallback } from "react";

import type {
  DatasetStyleOptions,
  UseDatasetStyleVariantReturn,
} from "./types";

/**
 * Dataset Style Variant Hook
 *
 * Manages:
 * - Visual variant (compact, normal, spacious)
 * - Theme (light, dark)
 *
 * Widget-specific styling options
 * Not reusable across other tables (user-specific)
 */

const DEFAULT_STYLE_OPTIONS: DatasetStyleOptions = {
  variant: "normal",
  theme: "light",
};

interface UseDatasetStyleVariantOptions {
  initialStyle?: DatasetStyleOptions;
}

export function useDatasetStyleVariant(
  options?: UseDatasetStyleVariantOptions,
): UseDatasetStyleVariantReturn {
  const [styleOptions, setStyleOptions] = useState<DatasetStyleOptions>({
    ...DEFAULT_STYLE_OPTIONS,
    ...options?.initialStyle,
  });

  /**
   * Change visual variant
   */
  const setStyleVariant = useCallback(
    (variant: "compact" | "normal" | "spacious") => {
      setStyleOptions((prev) => ({
        ...prev,
        variant,
      }));
    },
    [],
  );

  /**
   * Change theme
   */
  const setTheme = useCallback((theme: "light" | "dark") => {
    setStyleOptions((prev) => ({
      ...prev,
      theme,
    }));
  }, []);

  return {
    styleOptions,
    setStyleVariant,
    setTheme,
  };
}
