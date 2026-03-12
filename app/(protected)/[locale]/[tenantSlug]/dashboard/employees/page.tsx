"use client";

import { useSuspenseQuery } from "@apollo/client/react";

import { EMPLOYEES_PAGE_QUERY } from "@/shared/graphql/client/dashboardQueries";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Employees page widgets
// import { EmployeeStats, EmployeeFilters, EmployeeTable } from '@/widgets/dashboard/employees'

export default function EmployeesPage() {
  const { data } = useSuspenseQuery(EMPLOYEES_PAGE_QUERY, {
    variables: {
      first: 50,
      offset: 0,
    },
  });

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <EmployeeStats employees={data.employees.edges} /> */}
        {/* <EmployeeFilters departments={data.departments} /> */}
        {/* <EmployeeTable employees={data.employees.edges} pageInfo={data.employees.pageInfo} totalCount={data.employees.totalCount} /> */}
      </div>
    </ScrollArea>
  );
}
