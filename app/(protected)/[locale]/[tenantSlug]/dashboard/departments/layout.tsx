import { ReactNode } from "react";

import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { GetDepartmentsDocument } from "@/entities/core/department";
import { PreloadQuery, query } from "@/shared/lib/apollo-client/apolloClient";

export default async function DepartmentsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  console.warn("[DepartmentsLayout] Loading company for slug:", tenantSlug);
  // Get company data from cache (already preloaded in parent layout)
  const { data: companyData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
  });

  console.warn(
    "[DepartmentsLayout] Company response:",
    JSON.stringify(companyData, null, 2),
  );

  const companyId = companyData?.companyBySlug?.id;
  console.warn("[DepartmentsLayout] Extracted company ID:", companyId);

  if (!companyId) {
    console.error(
      "[DepartmentsLayout] Company not found for slug:",
      tenantSlug,
    );
    throw new Error(`Company not found for slug: ${tenantSlug}`);
  }

  return (
    <PreloadQuery
      query={GetDepartmentsDocument}
      variables={{ filter: { companyId } }}
    >
      {children}
    </PreloadQuery>
  );
}
