import { ReactNode } from "react";

import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { PreloadQuery, query } from "@/shared/lib/apollo-client/apolloClient";

export default async function TenantLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  const { data: debugData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
    fetchPolicy: "network-only",
  });

  return (
    <PreloadQuery
      query={GetCompanyBySlugDocument}
      variables={{ slug: tenantSlug }}
    >
      {children}
    </PreloadQuery>
  );
}
