"use client";

import { UseFormReturn } from "react-hook-form";

import {
  userTableFilterConfig,
  UserTableFilterValues,
  FilterSwitch,
  FilterTextInput,
  FilterDateRange,
  FilterCheckboxGroup,
} from "@/entities/user";

interface UserFilterFormProps {
  form: UseFormReturn<UserTableFilterValues>;
  /** If true, only render drawer filters */
  drawerOnly?: boolean;
  /** Filter visibility: array of filter field IDs to show, undefined = all */
  filters?: string[];
}

/**
 * Dynamic form renderer that maps FilterFieldConfig → entity component
 * Automatically selects UI component based on field.type
 * Can filter which fields to show via filters array
 */
export function UserFilterForm({
  form,
  drawerOnly = false,
  filters,
}: UserFilterFormProps) {
  let fieldsToRender = drawerOnly
    ? userTableFilterConfig.filter((field) => field.section !== "global")
    : userTableFilterConfig;

  // If filters array provided, further filter to only those IDs
  if (filters !== undefined) {
    fieldsToRender = fieldsToRender.filter((field) =>
      filters.includes(field.id),
    );
  }

  return (
    <div className="space-y-4">
      {fieldsToRender.map((field) => {
        // Respect visibility flags
        if (field.visible === false) return null;

        const commonProps = {
          key: field.id,
          form,
          config: field,
        };

        // Map field.type to entity component
        switch (field.type) {
          case "text":
            return (
              <FilterTextInput key={field.id} form={form} config={field} />
            );

          //   case "select":
          // return <FilterSelect key={field.id} form={form} config={field} />;

          case "switch":
            return <FilterSwitch key={field.id} form={form} config={field} />;

          case "date-range":
            return (
              <FilterDateRange key={field.id} form={form} config={field} />
            );

          case "checkbox":
            return (
              <FilterCheckboxGroup key={field.id} {...(commonProps as any)} />
            );

          default:
            console.warn(`Unknown filter type: ${field.type}`);
            return null;
        }
      })}
    </div>
  );
}
