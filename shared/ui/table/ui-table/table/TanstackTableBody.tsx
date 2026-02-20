"use client";

import { useMemo } from "react";

import { Table } from "@tanstack/react-table";

import { TableBody } from "@/shared/ui/shadcn";

import { TableBodyRows } from "./TableBodyRows";

type Props<TData> = {
  table: Table<TData>;
};

export function TanstackTableBody<TData>({ table }: Props<TData>) {
  const rows = useMemo(() => table.getRowModel().rows, [table]);
  return (
    <TableBody>
      <TableBodyRows rows={rows} />
    </TableBody>

    // <tbody>
    //   <TableBodyRows rows={table.getRowModel().rows} />
    // </tbody>
  );
}
