"use client";

import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";

import type { UserTableRow } from "@/entities/user";

/**
 * Hook to build User dataset columns
 * Returns TanStack ColumnDef array for the users dataset display
 */
export function useUserDatasetColumns() {
  const columns = useMemo<ColumnDef<UserTableRow>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        size: 150,
        cell: (info) => {
          const date = info.getValue() as Date;
          return date instanceof Date
            ? date.toLocaleDateString()
            : String(date);
        },
      },
    ];
  }, []);

  return { columns };
}
