"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import { Switch } from "@/shared/ui";

import { FilterFieldConfig } from "../../model/filters/config";

interface FilterSwitchProps {
  form: UseFormReturn<any>;
  config: FilterFieldConfig;
  className?: string;
}

/**
 * Reusable switch filter component
 * Three states: null (all), true, false
 */
export function FilterSwitch({ form, config, className }: FilterSwitchProps) {
  return (
    <Controller
      control={form.control}
      name={config.id}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{config.label}</label>
            <Switch
              checked={field.value === true}
              onCheckedChange={(checked: boolean) => {
                if (field.value === true && !checked) {
                  // true → null (clear)
                  field.onChange(null);
                } else if (field.value === null && checked) {
                  // null → true
                  field.onChange(true);
                } else if (!checked && field.value === null) {
                  // Already null, click to false
                  field.onChange(false);
                } else if (checked && field.value === false) {
                  // false → true
                  field.onChange(true);
                }
              }}
              disabled={config.disabled}
            />
          </div>
          {config.description && (
            <p className="text-xs text-gray-500">{config.description}</p>
          )}
          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
          {field.value !== null && (
            <p className="text-xs text-gray-500 mt-1">
              {field.value === true ? "✓ Verified" : "✗ Not verified"}
            </p>
          )}
        </div>
      )}
    />
  );
}
