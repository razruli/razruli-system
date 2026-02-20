"use client";

import { Row } from "@tanstack/react-table";

import { TableRow } from "@/shared/ui/shadcn/table";

import { TableRowCells } from "./TableRowCells";

type Props<TData> = {
  rows: Row<TData>[];
};

export function TableBodyRows<TData>({ rows }: Props<TData>) {
  return rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
      <TableRowCells cells={row.getVisibleCells()} />
    </TableRow>
  ));
}
