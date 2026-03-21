import { z } from "zod";

export const RoleFormSchema = z.object({
  phone: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["admin", "manager", "user", "viewer"]),
});

export type RoleFormData = z.infer<typeof RoleFormSchema>;

export const ROLES = [
  {
    value: "admin" as const,
    label: "Administrator",
    description: "Full access to all features and settings",
  },
  {
    value: "manager" as const,
    label: "Manager",
    description: "Manage teams and view analytics",
  },
  {
    value: "user" as const,
    label: "User",
    description: "Access to core features and your data",
  },
  {
    value: "viewer" as const,
    label: "Viewer",
    description: "Read-only access to reports",
  },
];
