// "use client";

// import { useSuspenseQuery } from "@apollo/client/react";

// import {
//   GetDashboardOverviewBatchDocument,
//   type GetDashboardOverviewBatchQuery,
//   type GetDashboardOverviewBatchQueryVariables,
// } from "@/shared/graphql/generated";

// /**
//  * Batch hook: Load dashboard overview data with Suspense
//  * Loads in parallel: stats + top departments + recent activity
//  *
//  * Used in: app/.../dashboard/layout.tsx or app/.../dashboard/page.tsx
//  * Suspends until all data loads, then widgets read from Apollo cache
//  */
// export function useGetDashboardOverviewBatch(
//   variables: Partial<GetDashboardOverviewBatchQueryVariables> = {},
// ) {
//   return useSuspenseQuery<
//     GetDashboardOverviewBatchQuery,
//     GetDashboardOverviewBatchQueryVariables
//   >(GetDashboardOverviewBatchDocument, {
//     variables: {
//       departmentsLimit: 5,
//       activityLimit: 10,
//       ...variables,
//     },
//   });
// }
