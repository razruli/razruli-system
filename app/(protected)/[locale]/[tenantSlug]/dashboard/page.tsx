import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { query } from "@/shared/lib";
/**
 * Dashboard Page
 * Main dashboard entry point that displays overview and key metrics
 * Data is preloaded via PreloadQuery in the layout
 */
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  // Get company from cache (preloaded in layout)
  const { data: companyData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
  });

  const companyId = companyData?.companyBySlug?.id;

  if (!companyId) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading company data...
      </div>
    );
  }

  return <></>;
}
