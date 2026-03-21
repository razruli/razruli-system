/**
 * Suspense Query Hook for Employees
 * Fetches all employees for a company with cache-first strategy
 *
 * Usage with Suspense:
 * ```tsx
 * <Suspense fallback={<EmployeesSkeleton />}>
 *   <EmployeesList companyId={id} />
 * </Suspense>
 *
 * function EmployeesList({ companyId }: { companyId: string }) {
 *   const { data } = useSuspenseQueryEmployees(companyId);
 *   return data.employees.nodes.map(emp => (...))
 * }
 * ```
 */

import { useSuspenseQuery } from "@apollo/client/react";

import {
  GetEmployeesDocument,
  GetEmployeesQuery,
} from "@/shared/graphql/generated";

export function useSuspenseQueryEmployees(companyId: string) {
  return useSuspenseQuery<GetEmployeesQuery>(GetEmployeesDocument, {
    variables: {
      filter: { companyId },
      pagination: { offset: 0, limit: 1000 }, // Fetch up to 1000 (change based on your needs)
    },
    // Cache-first strategy: Use cached data first, only fetch if missing
    fetchPolicy: "cache-first",
  });
}
