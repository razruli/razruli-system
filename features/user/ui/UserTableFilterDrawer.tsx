"use client";

import { useMemo, useEffect } from "react";

import { UseFormReturn } from "react-hook-form";

import type { UserTableFilterValues } from "@/entities/user";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";

import { UserFilterForm } from "./userFilterForm";

interface UserTableFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<UserTableFilterValues>;
  onApply: (values: UserTableFilterValues) => void;
  onReset: () => void;
  /** Currently applied filter values from query - to detect changes */
  appliedFilters?: Partial<UserTableFilterValues>;
  /** Filter visibility: array of filter field IDs to show */
  filters?: string[];
}

/**
 * Right-side drawer containing filter form
 * Renders dynamic form using UserFilterForm component
 * Applies, resets, and closes
 */
export function UserTableFilterDrawer({
  isOpen,
  onClose,
  form,
  onApply,
  onReset,
  appliedFilters = {},
  filters,
}: UserTableFilterDrawerProps) {
  // Watch form values to detect changes
  const formValues = form.watch();

  // Determine if form values differ from applied filters
  const hasChanges = useMemo(() => {
    if (!formValues) return false;

    // Compare each field
    const keys = Object.keys(formValues) as Array<keyof UserTableFilterValues>;
    return keys.some((key) => {
      const formVal = formValues[key];
      const appliedVal = appliedFilters[key];

      // For date range, compare from/to separately
      if (key === "createdDate") {
        return (
          formVal?.from !== appliedVal?.from || formVal?.to !== appliedVal?.to
        );
      }

      return JSON.stringify(formVal) !== JSON.stringify(appliedVal);
    });
  }, [formValues, appliedFilters]);

  // Check if ANY filter is currently applied
  const hasAppliedFilters = useMemo(() => {
    if (!appliedFilters || Object.keys(appliedFilters).length === 0)
      return false;

    return !!Object.entries(appliedFilters).some(([_, value]) => {
      if (value === "" || value === undefined || value === null) return false;
      if (typeof value === "object") {
        if ("from" in value || "to" in value) {
          return value.from !== undefined || value.to !== undefined;
        }
      }
      return true;
    });
  }, [appliedFilters]);

  const handleApply = () => {
    if (hasChanges) {
      const values = form.getValues();
      onApply(values);
      onClose();
    }
  };

  const handleReset = () => {
    onReset();
    form.reset();
  };

  // Sync form with applied filters when drawer opens
  useEffect(() => {
    if (isOpen && appliedFilters) {
      form.reset({
        search: appliedFilters.search || "",
        status: appliedFilters.status || undefined,
        emailVerified:
          appliedFilters.emailVerified === undefined
            ? null
            : appliedFilters.emailVerified,
        createdDate: {
          from: (appliedFilters as any)?.createdDate?.from || undefined,
          to: (appliedFilters as any)?.createdDate?.to || undefined,
        },
      });
    }
  }, [isOpen, appliedFilters, form]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine your user search with advanced filters
          </SheetDescription>
        </SheetHeader>

        {/* Dynamic form with drawer-only filters */}
        <div className="mt-6">
          <UserFilterForm form={form} drawerOnly filters={filters} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-8 pt-6 border-t fixed bottom-0 right-0 w-96 p-4 bg-background">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
            disabled={!hasAppliedFilters}
            title={
              !hasAppliedFilters ? "No filters to reset" : "Reset all filters"
            }
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1"
            disabled={!hasChanges}
            title={!hasChanges ? "No changes to apply" : "Apply filter changes"}
          >
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
