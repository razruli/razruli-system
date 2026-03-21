import { ReactNode } from "react";

import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { GetProcessesDocument } from "@/entities/operations/process";
import { PreloadQuery, query } from "@/shared/lib/apollo-client/apolloClient";

export default async function ProcessesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  console.warn("[ProcessesLayout] Loading company for slug:", tenantSlug);
  // Get company data from cache (already preloaded in parent layout)
  const { data: companyData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
  });

  console.warn(
    "[ProcessesLayout] Company response:",
    JSON.stringify(companyData, null, 2),
  );

  const companyId = companyData?.companyBySlug?.id;
  console.warn("[ProcessesLayout] Extracted company ID:", companyId);

  if (!companyId) {
    console.error("[ProcessesLayout] Company not found for slug:", tenantSlug);
    throw new Error(`Company not found for slug: ${tenantSlug}`);
  }

  return (
    <PreloadQuery
      query={GetProcessesDocument}
      variables={{ filter: { companyId } }}
    >
      {children}
    </PreloadQuery>
  );
}
