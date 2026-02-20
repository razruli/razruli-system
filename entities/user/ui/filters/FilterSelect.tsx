"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import { FilterFieldConfig } from "../../model/filters/config";

interface FilterSelectProps {
  form: UseFormReturn<any>;
  config: FilterFieldConfig;
  className?: string;
}

/**
 * Reusable select filter component
 * Connects to react-hook-form automatically
 */
export function FilterSelect({ form, config, className }: FilterSelectProps) {
  return (
    <Controller
      control={form.control}
      name={config.id}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <label className="block text-sm font-medium mb-2">
            {config.label}
            {config.description && (
              <span className="text-xs text-gray-500 ml-1">
                - {config.description}
              </span>
            )}
          </label>
          <Select
            value={field.value || "a"}
            onValueChange={(value) => field.onChange(value || null)}
            disabled={config.disabled}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={config.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {config.clearable && (
                <SelectItem value="">Clear filter</SelectItem>
              )}
              {config.options?.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.icon && (
                    <span className="mr-2 inline-block">{option.icon}</span>
                  )}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
