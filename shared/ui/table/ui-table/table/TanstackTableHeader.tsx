"use client";

import { Table, flexRender } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "../../../../lib/shadcn/utils";
import { TableHead, TableHeader, TableRow } from "../../../shadcn/";

type Props<TData> = {
  table: Table<TData>;
};

export function TanstackTableHeader<TData>({ table }: Props<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                style={{ width: `${header.getSize()}px` }}
                className="h-11"
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <div
                    className={cn(
                      header.column.getCanSort() &&
                        "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={(e) => {
                      // Enhanced keyboard handling for sorting
                      if (
                        header.column.getCanSort() &&
                        (e.key === "Enter" || e.key === " ")
                      ) {
                        e.preventDefault();
                        header.column.getToggleSortingHandler()?.(e);
                      }
                    }}
                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: (
                        <ChevronUpIcon
                          className="shrink-0 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      ),
                      desc: (
                        <ChevronDownIcon
                          className="shrink-0 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
