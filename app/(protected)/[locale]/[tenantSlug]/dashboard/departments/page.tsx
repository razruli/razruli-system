"use client";

import { useSuspenseQuery } from "@apollo/client/react";

import { DEPARTMENTS_PAGE_QUERY } from "@/shared/graphql/client/dashboardQueries";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Departments page widgets
// import { DepartmentsList, DepartmentStats, DepartmentChart } from '@/widgets/dashboard/departments'

export default function DepartmentsPage() {
  const { data } = useSuspenseQuery(DEPARTMENTS_PAGE_QUERY, {
    variables: {
      first: 50,
      offset: 0,
    },
  });

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <DepartmentsList departments={data.departments.edges} pageInfo={data.departments.pageInfo} totalCount={data.departments.totalCount} /> */}
        {/* <DepartmentStats departments={data.departments.edges} /> */}
        {/* <DepartmentChart departments={data.departments.edges} /> */}
      </div>
    </ScrollArea>
  );
}
