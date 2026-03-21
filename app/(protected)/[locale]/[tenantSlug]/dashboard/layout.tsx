import { DashboardSidebar } from "@/components/dashboard/sidebar";
// import { DASHBOARD_OVERVIEW_QUERY } from "@/shared/graphql/client/dashboardQueries";
// import { PreloadQuery } from "@/shared/lib";
import { SidebarInset, SidebarProvider } from "@/shared/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <PreloadQuery query={DASHBOARD_OVERVIEW_QUERY}>
    <SidebarProvider defaultOpen>
      <DashboardSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
    // </PreloadQuery>
  );
}
