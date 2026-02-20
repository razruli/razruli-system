"use client";

import { X } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Button, Input } from "@/shared/ui";

import { FilterFieldConfig } from "../../model/filters/config";

interface FilterDateRangeProps {
  form: UseFormReturn<any>;
  config: FilterFieldConfig;
  className?: string;
}

/**
 * Reusable date range filter component
 * Uses native date inputs
 */
export function FilterDateRange({
  form,
  config,
  className,
}: FilterDateRangeProps) {
  return (
    <Controller
      control={form.control}
      name={config.id}
      render={({ field, fieldState: { error } }) => {
        const value = field.value || { from: null, to: null };
        const fromVal = value.from
          ? value.from instanceof Date
            ? value.from.toISOString().split("T")[0]
            : value.from
          : "";
        const toVal = value.to
          ? value.to instanceof Date
            ? value.to.toISOString().split("T")[0]
            : value.to
          : "";

        return (
          <div className={className}>
            <label className="block text-sm font-medium mb-2">
              {config.label}
              {config.description && (
                <span className="text-xs text-gray-500 ml-1">
                  - {config.description}
                </span>
              )}
            </label>
            <div className="flex gap-2 flex-wrap items-center">
              <Input
                type="date"
                value={fromVal}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  field.onChange({
                    ...value,
                    from: date,
                  });
                }}
                className={`w-40 ${error ? "border-red-500" : ""}`}
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                value={toVal}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  field.onChange({
                    ...value,
                    to: date,
                  });
                }}
                className={`w-40 ${error ? "border-red-500" : ""}`}
              />
              {config.clearable && (fromVal || toVal) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => field.onChange({ from: null, to: null })}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-1">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
