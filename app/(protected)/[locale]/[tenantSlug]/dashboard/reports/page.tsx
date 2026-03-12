"use client";

import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Reports page widgets
// import { ReportsList, ReportBuilder, ReportTemplate, ReportExport } from '@/widgets/dashboard/reports'

export default function ReportsPage() {
  // TODO: Add useSuspenseQuery for reports data when needed
  // const { data } = useSuspenseQuery(REPORTS_PAGE_QUERY);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <ReportsList /> */}
        {/* <ReportBuilder /> */}
        {/* <ReportTemplate /> */}
        {/* <ReportExport /> */}
      </div>
    </ScrollArea>
  );
}
