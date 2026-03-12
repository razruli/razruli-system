"use client";

import { useSuspenseQuery } from "@apollo/client/react";

import { HIRING_PAGE_QUERY } from "@/shared/graphql/client/dashboardQueries";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
// Hiring page widgets
// import { HiringStats, OpenPositionsList, HiringTrend, DepartmentHiringPlans } from '@/widgets/dashboard/hiring'

export default function HiringPage() {
  const { data } = useSuspenseQuery(HIRING_PAGE_QUERY);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <HiringStats stats={data.hiringStats} /> */}
        {/* <OpenPositionsList positions={data.positions} /> */}
        {/* <HiringTrend trend={data.hiringTrend} /> */}
        {/* <DepartmentHiringPlans plans={data.departmentHiringPlans} /> */}
      </div>
    </ScrollArea>
  );
}
