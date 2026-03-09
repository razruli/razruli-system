"use client";

import {
  WorkloadChart,
  HiringTrendChart,
  ProcessDistributionChart,
  SkillGapChart,
} from "@/components/dashboard/charts";
import { EmployeeTable } from "@/components/dashboard/eployee-table";
import { HiringRequestForm } from "@/components/dashboard/hiring-form";
import { DashboardHeader } from "@/components/dashboard/sidebar";
import {
  StatsCards,
  DepartmentWorkloadCards,
} from "@/components/dashboard/stats";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/shadcn/tabs";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-6 p-6">
          {/* KPI cards */}
          <StatsCards />

          {/* Main tabbed area */}
          <Tabs defaultValue="overview" className="flex flex-col gap-4">
            <TabsList className="w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="hiring">Hiring</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex flex-col gap-6 mt-0">
              {/* Charts row 1 */}
              <div className="grid gap-6 lg:grid-cols-2">
                <WorkloadChart />
                <div className="grid gap-6">
                  <ProcessDistributionChart />
                </div>
              </div>

              {/* Charts row 2 */}
              <div className="grid gap-6 lg:grid-cols-2">
                <HiringTrendChart />
                <div className="grid gap-6">
                  <SkillGapChart />
                </div>
              </div>

              {/* Department workload */}
              <DepartmentWorkloadCards />
            </TabsContent>

            <TabsContent value="employees" className="mt-0">
              <EmployeeTable />
            </TabsContent>

            <TabsContent value="hiring" className="mt-0">
              <HiringRequestForm />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      {/* <Toaster /> */}
    </>
  );
}
