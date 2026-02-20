"use client";

import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import {
  userDatasetFilterConfig,
  userDatasetFilterDefaults,
} from "@/entities/user";
import type { UserDatasetFilterValues } from "@/entities/user";

/**
 * Hook for managing user dataset filter form state
 *
 * Combines react-hook-form with Zod validation based on entity filter configuration.
 * Enables real-time validation and dirty state tracking for filter forms.
 *
 * @param defaultOverrides - Override default filter values
 * @returns React Hook Form instance with typed filter values
 *
 * @example
 * const form = useUserDatasetFilterForm();
 * const { getValues, handleSubmit } = form;
 *
 * @see entities/user/model/filters/config
 */
export function useUserDatasetFilterForm(
  defaultOverrides?: Partial<UserDatasetFilterValues>,
): UseFormReturn<UserDatasetFilterValues> {
  // Memoize schema building to prevent recreating on every render
  const schema = useMemo(() => {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    userDatasetFilterConfig.forEach((field) => {
      if (field.validation) {
        schemaObject[field.id] = field.validation;
      } else {
        // Fallback validation based on field type
        switch (field.type) {
          case "text":
            schemaObject[field.id] = z.string().optional().nullable();
            break;
          case "select":
            schemaObject[field.id] = z.string().nullable().optional();
            break;
          case "switch":
            schemaObject[field.id] = z.boolean().nullable().optional();
            break;
          case "checkbox":
            schemaObject[field.id] = z.array(z.string()).optional();
            break;
          case "date-range":
            schemaObject[field.id] = z
              .object({
                from: z.date().nullable().optional(),
                to: z.date().nullable().optional(),
              })
              .optional();
            break;
          default:
            schemaObject[field.id] = z.any().optional();
        }
      }
    });

    return z.object(schemaObject);
  }, []); // Empty deps - schema is always the same based on static config

  // Memoize default values to prevent form recreation
  const defaultValues = useMemo(
    () => ({
      ...userDatasetFilterDefaults,
      ...defaultOverrides,
    }),
    [defaultOverrides],
  );

  return useForm<UserDatasetFilterValues>({
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });
}
