"use client";

import { Cell, flexRender } from "@tanstack/react-table";

import { TableCell } from "@/shared/ui/shadcn/table";

type Props<TData> = {
  cells: Cell<TData, unknown>[];
};

export function TableRowCells<TData>({ cells }: Props<TData>) {
  return (
    <>
      {cells.map((cell) => (
        <TableCell key={cell.id} className="last:py-0">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </>
  );
}
