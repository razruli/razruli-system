"use client";


import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Departments page widgets
// import { DepartmentsList, DepartmentStats, DepartmentChart } from '@/widgets/dashboard/departments'

export default function DepartmentsPage() {
  // TODO: Connect to entity hooks once available
  // const { data } = useSuspenseQuery(DEPARTMENTS_PAGE_QUERY, { ... });

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
