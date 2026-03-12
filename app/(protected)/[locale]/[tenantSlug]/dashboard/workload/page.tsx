"use client";

import { useSuspenseQuery } from "@apollo/client/react";

import { WORKLOAD_PAGE_QUERY } from "@/shared/graphql/client/dashboardQueries";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Workload page widgets
// import { WorkloadTrend, DepartmentComparison, EmployeeRanking, CapacityForecast } from '@/widgets/dashboard/workload'

export default function WorkloadPage() {
  const { data } = useSuspenseQuery(WORKLOAD_PAGE_QUERY);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <WorkloadTrend data={data.workloadTrend} /> */}
        {/* <DepartmentComparison departments={data.departmentWorkload} /> */}
        {/* <EmployeeRanking employees={data.employeeWorkload} /> */}
        {/* <CapacityForecast forecast={data.capacityForecast} /> */}
      </div>
    </ScrollArea>
  );
}
