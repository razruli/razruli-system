import { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { GetDashboardOverviewDocument } from "@/entities/system/dashboard-overview";
import { PreloadQuery, query } from "@/shared/lib/apollo-client/apolloClient";
import { SidebarProvider } from "@/shared/ui/shadcn/sidebar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  // Get company ID from cache (already preloaded in parent layout)
  const { data: companyData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
  });

  const companyId = companyData?.companyBySlug?.id;

  if (!companyId) {
    throw new Error(`Company not found for slug: ${tenantSlug}`);
  }

  return (
    <PreloadQuery
      query={GetDashboardOverviewDocument}
      variables={{
        companyId,
        departmentFilter: { companyId },
        employeeFilter: { companyId },
        employeePagination: { offset: 0, limit: 20 },
      }}
    >
      <SidebarProvider>
        <div className="flex h-screen">
          <DashboardSidebar />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </SidebarProvider>
    </PreloadQuery>
  );
}
