"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/shared/ui";

import { FilterFieldConfig } from "../../model/filters/config";

interface FilterCheckboxGroupProps {
  form: UseFormReturn<any>;
  config: FilterFieldConfig & { type: "checkbox" };
  className?: string;
}

/**
 * Reusable checkbox group filter component
 * Allows multiple selections
 */
export function FilterCheckboxGroup({
  form,
  config,
  className,
}: FilterCheckboxGroupProps) {
  return (
    <Controller
      control={form.control}
      name={config.id}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <label className="block text-sm font-medium mb-3">
            {config.label}
            {config.description && (
              <span className="text-xs text-gray-500 ml-1">
                - {config.description}
              </span>
            )}
          </label>
          <div className="space-y-2">
            {config.options?.map((option) => (
              <div key={String(option.value)} className="flex items-center">
                <Checkbox
                  id={`${config.id}-${option.value}`}
                  checked={(field.value || []).includes(String(option.value))}
                  onCheckedChange={(checked: boolean) => {
                    const value = String(option.value);
                    const newValue = checked
                      ? [...(field.value || []), value]
                      : (field.value || []).filter((v: string) => v !== value);
                    field.onChange(newValue);
                  }}
                  disabled={config.disabled}
                />
                <label
                  htmlFor={`${config.id}-${option.value}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {option.icon && (
                    <span className="mr-2 inline-block">{option.icon}</span>
                  )}
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
