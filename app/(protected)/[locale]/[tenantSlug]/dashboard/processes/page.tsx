"use client";

import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Processes page widgets
// import { ProcessesList, ProcessStats, ProcessFilters } from '@/widgets/dashboard/processes'

export default function ProcessesPage() {
  // TODO: Connect to entity hooks once available
  // const { data } = useSuspenseQuery(PROCESSES_PAGE_QUERY, { ... });

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <ProcessStats processes={data.processes.edges} /> */}
        {/* <ProcessFilters departments={data.departments} /> */}
        {/* <ProcessesList processes={data.processes.edges} pageInfo={data.processes.pageInfo} totalCount={data.processes.totalCount} /> */}
      </div>
    </ScrollArea>
  );
}
