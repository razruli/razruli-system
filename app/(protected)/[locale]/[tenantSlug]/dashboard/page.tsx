"use client";

import { useSuspenseQuery } from "@apollo/client/react";

import { DASHBOARD_OVERVIEW_QUERY } from "@/shared/graphql/client/dashboardQueries";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Overview page widgets
// import { StatsCards, CapacityOverview, DepartmentStatus, RecentActivity } from '@/widgets/dashboard/overview'

export default function DashboardPage() {
  const { data } = useSuspenseQuery(DASHBOARD_OVERVIEW_QUERY);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <StatsCards data={data.stats} /> */}
        {/* <CapacityOverview departments={data.departments} /> */}
        {/* <DepartmentStatus departments={data.departments} /> */}
        {/* <RecentActivity activities={data.recentActivity} /> */}
      </div>
    </ScrollArea>
  );
}
//               <div className="grid gap-6 lg:grid-cols-2">
//                 <HiringTrendChart />
//                 <div className="grid gap-6">
//                   <SkillGapChart />
//                 </div>
//               </div>

//               {/* Department workload */}
//               <DepartmentWorkloadCards />
//             </TabsContent>

//             <TabsContent value="employees" className="mt-0">
//               <EmployeeTable />
//             </TabsContent>

//             <TabsContent value="hiring" className="mt-0">
//               <HiringRequestForm />
//             </TabsContent>
//           </Tabs>
//         </div>
//       {/* <Toaster /> */}
//     </>
//   );
// }
