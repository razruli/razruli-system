// feature/user/table/filter/model/useUserTableFilters.ts
"use client";

import { useMemo, useCallback } from "react";

import { UseFormReturn } from "react-hook-form";

import type { UserTableFilterValues } from "@/entities/user";
import { userTableFilterConfig } from "@/entities/user";

/**
 * Transforms react-hook-form values to GQL variables
 */
export function useUserTableFilters(
  filterForm: UseFormReturn<UserTableFilterValues>,
) {
  const formValues = filterForm.watch();

  // Transform form values → GQL variables
  const gqlVariables = useMemo(() => {
    const vars: Record<string, any> = {};

    userTableFilterConfig.forEach((config) => {
      const value = formValues[config.id as keyof UserTableFilterValues];

      if (
        value !== config.defaultValue &&
        value !== null &&
        value !== undefined
      ) {
        if (config.type === "date-range") {
          const dateValue = value as { from: Date | null; to: Date | null };
          if (dateValue.from) {
            vars[config.serverField] = dateValue.from.toISOString();
          }
          if (dateValue.to && config.serverFieldTo) {
            vars[config.serverFieldTo] = dateValue.to.toISOString();
          }
        } else {
          vars[config.serverField] = value;
        }
      }
    });

    return vars;
  }, [formValues]);

  // Get active filter count (for badge)
  const activeFilterCount = useMemo(() => {
    return userTableFilterConfig.filter((config) => {
      const value = formValues[config.id as keyof UserTableFilterValues];
      return (
        value !== config.defaultValue && value !== null && value !== undefined
      );
    }).length;
  }, [formValues]);

  // Get drawer filters only (for form display)
  const drawerFilters = useMemo(() => {
    return userTableFilterConfig.filter((c) => c.section === "drawer");
  }, []);

  // Reset to defaults
  const reset = useCallback(() => {
    filterForm.reset();
  }, [filterForm]);

  return {
    form: filterForm,
    values: formValues,
    gqlVariables,
    activeFilterCount,
    drawerFilters,
    reset,
  };
}
