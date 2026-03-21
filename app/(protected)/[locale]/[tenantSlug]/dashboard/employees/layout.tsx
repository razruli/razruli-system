import { ReactNode } from "react";

import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { GetEmployeesDocument } from "@/entities/core/employee";
import { PreloadQuery, query } from "@/shared/lib/apollo-client/apolloClient";

export default async function EmployeesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  console.warn("[EmployeesLayout] Loading company for slug:", tenantSlug);
  // Get company data from cache (already preloaded in parent layout)
  const { data: companyData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
  });

  console.warn(
    "[EmployeesLayout] Company response:",
    JSON.stringify(companyData, null, 2),
  );

  const companyId = companyData?.companyBySlug?.id;
  console.warn("[EmployeesLayout] Extracted company ID:", companyId);

  // if (!companyId) {
  //   console.error("[EmployeesLayout] Company not found for slug:", tenantSlug);
  //   throw new Error(`Company not found for slug: ${tenantSlug}`);
  // }

  return (
    <PreloadQuery
      query={GetEmployeesDocument}
      variables={{ filter: { companyId } }}
    >
      {children}
    </PreloadQuery>
  );
}
