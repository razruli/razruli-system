import { z } from "zod";

/**
 * Filter configuration structure
 * Single source of truth for all filter possibilities
 */
export interface FilterFieldConfig {
  // Metadata
  id: string; // "status", "emailVerified", "createdDate"
  label: string; // "User Status"
  description?: string; // Help text

  // Form behavior
  type: "text" | "select" | "checkbox" | "date-range" | "switch"; // UI type
  defaultValue: any; // "" | null | false | []

  // Visibility
  section?: "drawer" | "global"; // Put in drawer or quick filters?
  visible?: boolean; // Hide from UI?

  // Server mapping
  serverField: string; // Maps to GQL variable name
  serverFieldTo?: string; // For date ranges (createdAfter/createdBefore)

  // Select/checkbox options
  options?: Array<{
    label: string;
    value: string | boolean;
    icon?: React.ReactNode;
  }>;

  // Validation
  validation?: z.ZodTypeAny; // Zod schema

  // Advanced
  disabled?: boolean;
  clearable?: boolean; // Can user explicitly clear?
  searchable?: boolean; // For select dropdowns
  placeholder?: string; // Placeholder text
}

/**
 * All possible filters for user table
 * This is THE registry
 */
export const userTableFilterConfig: FilterFieldConfig[] = [
  // SEARCH (global)
  {
    id: "search",
    label: "Search",
    type: "text",
    defaultValue: "",
    section: "global", // ← Special: not in form, separate input
    serverField: "search",
    visible: true,
    clearable: true,
    placeholder: "Search by name, email...",
    validation: z.string().optional(),
  },

  // DRAWER FILTERS
  {
    id: "status",
    label: "Status",
    type: "select",
    defaultValue: null,
    section: "drawer",
    serverField: "status",
    visible: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
    validation: z.enum(["active", "inactive", "pending"]).nullable(),
    clearable: true,
    searchable: true,
  },

  {
    id: "emailVerified",
    label: "Email Verified",
    type: "switch",
    defaultValue: null, // null = show all, true = verified, false = unverified
    section: "drawer",
    serverField: "emailVerified",
    visible: true,
    validation: z.boolean().nullable(),
  },

  {
    id: "createdDate",
    label: "Created Date",
    type: "date-range",
    defaultValue: { from: null, to: null },
    section: "drawer",
    serverField: "createdAfter", // ← Maps to two GQL variables!
    serverFieldTo: "createdBefore",
    visible: true,
    validation: z.object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    }),
    clearable: true,
  },

  // FUTURE: Can easily add more
  // {
  //   id: "role",
  //   label: "Role",
  //   type: "checkbox",
  //   ...
  // }
];

export const userTableFilterDefaults = userTableFilterConfig.reduce(
  (acc, field) => {
    acc[field.id] = field.defaultValue;
    return acc;
  },
  {} as Record<string, any>,
);

export const userDatasetFilterConfig = userTableFilterConfig;
export const userDatasetFilterDefaults = userTableFilterDefaults;
