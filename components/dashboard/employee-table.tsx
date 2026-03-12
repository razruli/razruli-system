"use client";

import { useState, useMemo } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { Progress } from "@/shared/ui/shadcn/progress";

type Employee = {
  id: string;
  name: string;
  initials: string;
  department: string;
  role: string;
  workload: number;
  processes: number;
  status: "active" | "overloaded" | "underutilized" | "available";
  hireDate: string;
};

const employees: Employee[] = [
  {
    id: "1",
    name: "Alice Chen",
    initials: "AC",
    department: "Engineering",
    role: "Senior Developer",
    workload: 95,
    processes: 5,
    status: "overloaded",
    hireDate: "2022-03-15",
  },
  {
    id: "2",
    name: "Bob Martinez",
    initials: "BM",
    department: "Engineering",
    role: "Tech Lead",
    workload: 88,
    processes: 4,
    status: "overloaded",
    hireDate: "2021-07-01",
  },
  {
    id: "3",
    name: "Carol Williams",
    initials: "CW",
    department: "Marketing",
    role: "Campaign Manager",
    workload: 72,
    processes: 3,
    status: "active",
    hireDate: "2023-01-10",
  },
  {
    id: "4",
    name: "David Kim",
    initials: "DK",
    department: "Sales",
    role: "Account Executive",
    workload: 65,
    processes: 4,
    status: "active",
    hireDate: "2022-11-20",
  },
  {
    id: "5",
    name: "Eva Johnson",
    initials: "EJ",
    department: "Product",
    role: "Product Manager",
    workload: 82,
    processes: 6,
    status: "active",
    hireDate: "2021-09-05",
  },
  {
    id: "6",
    name: "Frank Lee",
    initials: "FL",
    department: "Operations",
    role: "Ops Analyst",
    workload: 45,
    processes: 2,
    status: "available",
    hireDate: "2023-06-18",
  },
  {
    id: "7",
    name: "Grace Park",
    initials: "GP",
    department: "Engineering",
    role: "Frontend Developer",
    workload: 91,
    processes: 4,
    status: "overloaded",
    hireDate: "2022-05-22",
  },
  {
    id: "8",
    name: "Henry Nguyen",
    initials: "HN",
    department: "HR",
    role: "HR Specialist",
    workload: 58,
    processes: 3,
    status: "active",
    hireDate: "2023-02-14",
  },
  {
    id: "9",
    name: "Irene Davis",
    initials: "ID",
    department: "Finance",
    role: "Financial Analyst",
    workload: 74,
    processes: 3,
    status: "active",
    hireDate: "2022-08-30",
  },
  {
    id: "10",
    name: "Jake Thompson",
    initials: "JT",
    department: "Engineering",
    role: "Backend Developer",
    workload: 86,
    processes: 5,
    status: "overloaded",
    hireDate: "2021-12-01",
  },
  {
    id: "11",
    name: "Karen Liu",
    initials: "KL",
    department: "Marketing",
    role: "Content Strategist",
    workload: 68,
    processes: 3,
    status: "active",
    hireDate: "2023-04-07",
  },
  {
    id: "12",
    name: "Leo Brown",
    initials: "LB",
    department: "Sales",
    role: "Sales Manager",
    workload: 77,
    processes: 5,
    status: "active",
    hireDate: "2021-06-15",
  },
];

function getStatusBadge(status: Employee["status"]) {
  switch (status) {
    case "overloaded":
      return (
        <Badge variant="destructive" className="text-xs">
          Overloaded
        </Badge>
      );
    case "available":
      return (
        <Badge variant="secondary" className="text-xs">
          Available
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="text-xs border-chart-4 text-chart-4"
        >
          Active
        </Badge>
      );
  }
}

function getWorkloadColor(workload: number) {
  if (workload >= 90)
    return "[&>[data-slot=progress-indicator]]:bg-destructive";
  if (workload >= 75) return "[&>[data-slot=progress-indicator]]:bg-chart-4";
  return "[&>[data-slot=progress-indicator]]:bg-chart-3";
}

export function EmployeeTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const columns: ColumnDef<Employee>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Employee",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {row.original.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {row.original.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.role}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "department",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Department
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.department}
          </span>
        ),
      },
      {
        accessorKey: "workload",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Workload
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-32">
            <Progress
              value={row.original.workload}
              className={`h-2 flex-1 ${getWorkloadColor(row.original.workload)}`}
            />
            <span className="text-xs font-medium text-foreground w-8 text-right">
              {row.original.workload}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: "processes",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Processes
            <ArrowUpDown className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.processes}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        id: "actions",
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Edit Allocation</DropdownMenuItem>
              <DropdownMenuItem>Reassign Processes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    if (departmentFilter === "all") return employees;
    return employees.filter((e) => e.department === departmentFilter);
  }, [departmentFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 8 },
    },
  });

  const departments = [...new Set(employees.map((e) => e.department))];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-foreground">Employee Workload</CardTitle>
            <CardDescription>
              Track employee allocation across processes
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /> */}
              <Input
                placeholder="Search employees..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("name")?.setFilterValue(e.target.value)
                }
                className="pl-9 w-52"
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} employee(s) total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
