"use client";

import { memo, useCallback } from "react";

import { X, Settings2, Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import type { UserTableFilterValues } from "@/entities/user";
import { Button, Input, Badge } from "@/shared/ui";

interface UserTableFiltersBarProps {
  /** Form instance to watch search field */
  form: UseFormReturn<UserTableFilterValues>;
  /** Currently applied filter values - shows what's actually active */
  appliedFilters: Partial<UserTableFilterValues>;
  activeFilterCount: number;
  onOpenDrawer: () => void;
  onClearAll: () => void;
  onSearchChange?: (value: string) => void;
}

/**
 * 3-part filter UI:
 * [Search Input] | [Column Filter] | [Filters Button with Badge]
 *
 * Note: Search input value comes from form (immediate feedback)
 * Applied filters come from query (what's actually searching)
 */

/**
 * Memoized search input - prevents re-renders when parent form updates
 */
const SearchInputField = memo(function SearchInputField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
});

export const UserTableFiltersBar = memo(function UserTableFiltersBar({
  form,
  appliedFilters,
  activeFilterCount,
  onOpenDrawer,
  onClearAll,
  onSearchChange,
}: UserTableFiltersBarProps) {
  // Watch search field from form (immediate feedback as user types)
  const searchValue = form.watch("search") || "";
  const appliedSearch = appliedFilters.search || "";
  const hasActiveFilters = activeFilterCount > 0 || appliedSearch !== "";

  // Memoize handler to prevent passing new function every render
  const handleSearchChange = useCallback(
    (value: string) => onSearchChange?.(value),
    [onSearchChange],
  );

  return (
    <div className="flex items-center gap-2 mb-6">
      {/* Search Input - Memoized to prevent re-renders */}
      <SearchInputField value={searchValue} onChange={handleSearchChange} />

      {/* Placeholder for Column Filter */}
      <Button
        variant="ghost"
        size="sm"
        disabled
        title="Column filter coming soon"
      >
        <Settings2 className="w-4 h-4" />
      </Button>

      {/* Filters Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenDrawer}
        className="relative"
      >
        <Settings2 className="w-4 h-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <Badge
            variant="destructive"
            className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  );
});
