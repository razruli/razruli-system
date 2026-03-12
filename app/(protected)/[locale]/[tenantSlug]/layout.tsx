import { PRELOAD_USER_QUERY } from "@/shared/graphql/client/dashboardQueries";
import { PreloadQuery } from "@/shared/lib";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreloadQuery query={PRELOAD_USER_QUERY}>
      <>{children}</>
    </PreloadQuery>
  );
}
