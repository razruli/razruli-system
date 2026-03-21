/**
 * Suspense Query Hook for Departments
 * Fetches all departments for a company with cache-first strategy
 *
 * Usage with Suspense:
 * ```tsx
 * <Suspense fallback={<DepartmentsSkeleton />}>
 *   <DepartmentsList companyId={id} />
 * </Suspense>
 *
 * function DepartmentsList({ companyId }: { companyId: string }) {
 *   const { data } = useSuspenseQueryDepartments(companyId);
 *   return data.departments.nodes.map(dept => (...))
 * }
 * ```
 */

import { useSuspenseQuery } from "@apollo/client/react";

import {
  GetDepartmentsDocument,
  GetDepartmentsQuery,
} from "@/shared/graphql/generated";

export function useSuspenseQueryDepartments(companyId: string) {
  return useSuspenseQuery<GetDepartmentsQuery>(GetDepartmentsDocument, {
    variables: {
      filter: { companyId },
    },
    // Cache-first strategy: Use cached data first, only fetch if missing
    fetchPolicy: "cache-first",
  });
}
