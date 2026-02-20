"use client";

import { UseFormReturn } from "react-hook-form";

import type { UserTableFilterValues } from "@/entities/user";

import { useFilterDrawer } from "../model";

import { UserTableFilterDrawer } from "./UserTableFilterDrawer";
import { UserTableFiltersBar } from "./UserTableFiltersBar";

interface UserTableFiltersUIProps {
  form: UseFormReturn<UserTableFilterValues>;
  /** Currently applied filter values from query - source of truth for what's active */
  appliedFilters: any;
  /** Count of active filters */
  activeFilterCount: number;
  onApply: (values: UserTableFilterValues) => void;
  onReset: () => void;
  onSearchChange?: (value: string) => void;
  /** Filter visibility: array of filter field IDs to show, undefined = all, empty array = none */
  filters?: string[];
}

/**
 * Filter UI Orchestrator
 * Owns drawer open/close state - not the dataset widget's concern
 *
 * Encapsulates:
 * - Filter bar (search + filters button)
 * - Filter drawer (opened/closed by itself)
 * - Submit logic (apply filters + close drawer)
 * - Active filter count calculation from applied filters
 *
 * Interface to parent dataset-widget:
 * - onApply: called with filter params (dataset does what it wants with them)
 * - onReset: called to reset filters
 * - Drawer manages itself internally
 *
 * Note: Does NOT use form.watch() - instead calculates active filters from
 * appliedFilters state which is the source of truth. This prevents unnecessary
 * re-renders on every form field change.
 */
export function UserTableFiltersUI({
  form,
  appliedFilters,
  activeFilterCount,
  onApply,
  onReset,
  onSearchChange,
  filters,
}: UserTableFiltersUIProps) {
  // Drawer state lives here, not in dataset-widget
  const drawer = useFilterDrawer();

  return (
    <>
      {/* Filter Bar - search + filters button that opens drawer */}
      <UserTableFiltersBar
        form={form}
        appliedFilters={appliedFilters}
        activeFilterCount={activeFilterCount}
        onOpenDrawer={drawer.open}
        onClearAll={onReset}
        onSearchChange={onSearchChange}
      />

      {/* Filter Drawer - manages itself */}
      <UserTableFilterDrawer
        isOpen={drawer.isOpen}
        onClose={drawer.close}
        form={form}
        appliedFilters={appliedFilters}
        onApply={(values) => {
          onApply(values); // Tell parent: "apply these filters"
          drawer.close(); // Close myself
        }}
        onReset={onReset}
        filters={filters}
      />
    </>
  );
}
