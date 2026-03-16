// 'use client';

// import { useQuery } from '@apollo/client';
// import {
//   UseGetDepartments,
//   UseGetDepartmentsDocument,
//   type UseGetDepartmentsQuery,
//   type UseGetDepartmentsQueryVariables,
// } from '@/shared/graphql/generated';

// /**
//  * Batch loader for multiple queries using Apollo's cache
//  * Ideal for server-side data preloading with Suspense
//  *
//  * Benefits:
//  * - Single network request round trip
//  * - All data cached in Apollo InMemoryCache
//  * - Widgets can access via cache without re-fetching
//  * - Natural Suspense integration
//  */

// /**
//  * Batch: Dashboard Overview (stats + departments + activity)
//  * Used in: app/.../dashboard/page.tsx layout or page component
//  */
// export function useDashboardOverviewBatch(options: { suspense?: boolean } = {}) {
//   return useQuery<UseGetDepartmentsQuery, UseGetDepartmentsQueryVariables>(
//     UseGetDepartmentsDocument,
//     {
//       variables: {
//         first: 10,
//         offset: 0,
//       },
//       suspense: options.suspense ?? true,
//     }
//   );
// }

// /**
//  * Batch: Employees Page (employee list + departments for filters + capacity metrics)
//  * Used in: app/.../dashboard/employees/page.tsx
//  */
// export function useEmployeesPageBatch(variables: {
//   first?: number;
//   offset?: number;
//   searchTerm?: string;
//   departmentFilter?: string;
//   suspense?: boolean;
// }) {
//   // In a real scenario, this would batch multiple related queries
//   // For now, returning the list query - can be extended
//   return useQuery(UseGetDepartmentsDocument, {
//     variables: {
//       first: variables.first ?? 50,
//       offset: variables.offset ?? 0,
//     },
//     suspense: variables.suspense ?? true,
//   });
// }

// /**
//  * Batch: Workload Page (trends + department workload + employee rankings)
//  * Used in: app/.../dashboard/workload/page.tsx
//  */
// export function useWorkloadPageBatch(options: { suspense?: boolean } = {}) {
//   // Batch multiple workload-related queries
//   return useQuery(UseGetDepartmentsDocument, {
//     variables: {
//       first: 100,
//       offset: 0,
//     },
//     suspense: options.suspense ?? true,
//   });
// }

// /**
//  * Cache-read pattern: Widget queries data from Apollo cache
//  * Used in: individual widgets that need subset of preloaded data
//  *
//  * Example widget usage:
//  * ```ts
//  * export function StatsCard() {
//  *   const data = useReadDashboardStats();
//  *   return <div>{data.stats.totalEmployees}</div>;
//  * }
//  * ```
//  */
// export function useReadDashboardStats() {
//   const { data } = useQuery(UseGetDepartmentsDocument, {
//     variables: { first: 10, offset: 0 },
//   });
//   return data;
// }

// export function useReadEmployeeTableData() {
//   const { data } = useQuery(UseGetDepartmentsDocument, {
//     variables: { first: 50, offset: 0 },
//   });
//   return data;
// }
