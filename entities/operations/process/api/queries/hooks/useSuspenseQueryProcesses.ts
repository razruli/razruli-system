/**
 * Suspense Query Hook for Processes
 * Fetches all processes for a company with cache-first strategy
 *
 * Usage with Suspense:
 * ```tsx
 * <Suspense fallback={<ProcessesSkeleton />}>
 *   <ProcessesList companyId={id} />
 * </Suspense>
 *
 * function ProcessesList({ companyId }: { companyId: string }) {
 *   const { data } = useSuspenseQueryProcesses(companyId);
 *   return data.processes.nodes.map(proc => (...))
 * }
 * ```
 */

import { useSuspenseQuery } from "@apollo/client/react";

import {
  GetProcessesDocument,
  GetProcessesQuery,
} from "@/shared/graphql/generated";

export function useSuspenseQueryProcesses(companyId: string) {
  return useSuspenseQuery<GetProcessesQuery>(GetProcessesDocument, {
    variables: {
      filter: { companyId },
      pagination: { skip: 0, take: 1000 }, // Fetch up to 1000 (change based on your needs)
    },
    // Cache-first strategy: Use cached data first, only fetch if missing
    fetchPolicy: "cache-first",
  });
}
