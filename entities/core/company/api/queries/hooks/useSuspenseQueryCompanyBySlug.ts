/**
 * Suspense Query Hook for Company By Slug
 * Fetches company by slug (URL-friendly identifier) with network-first strategy
 * Always fetches from server first to ensure fresh data, falls back to cache if offline
 *
 * Usage in layout:
 * ```tsx
 * function CompanyPreloader({ slug }: { slug: string }) {
 *   useSuspenseQueryCompanyBySlug(slug);
 *   return null;
 * }
 *
 * <Suspense fallback={<Skeleton />}>
 *   <CompanyPreloader slug={slug} />
 *   {children}
 * </Suspense>
 * ```
 */

import { useSuspenseQuery } from "@apollo/client/react";

import {
  GetCompanyBySlugDocument,
  GetCompanyBySlugQuery,
} from "@/shared/graphql/generated";

export function useSuspenseQueryCompanyBySlug(slug: string) {
  return useSuspenseQuery<GetCompanyBySlugQuery>(GetCompanyBySlugDocument, {
    variables: { slug },
    fetchPolicy: "network-only",
  });
}
