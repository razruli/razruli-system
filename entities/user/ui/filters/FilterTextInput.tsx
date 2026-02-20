"use client";

import { X } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Input } from "@/shared/ui";

import { FilterFieldConfig } from "../../model/filters/config";

interface FilterTextInputProps {
  form: UseFormReturn<any>;
  config: FilterFieldConfig;
  className?: string;
}

// & { type: "text" }

/**
 * Reusable text input filter component
 */
export function FilterTextInput({
  form,
  config,
  className,
}: FilterTextInputProps) {
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
          <div className="relative">
            <Input
              placeholder={config.placeholder || "Type..."}
              value={field.value || ""}
              onChange={field.onChange}
              disabled={config.disabled}
              className={error ? "border-red-500" : ""}
            />
            {config.clearable && field.value && (
              <button
                onClick={() => field.onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
