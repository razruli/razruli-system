/**
 * ============================================================================
 * Company Domain - Subscription Resolvers
 * ============================================================================
 * Real-time GraphQL subscriptions for company changes via event emitter
 * Uses async iterators for efficient subscription management
 *
 * TODO: Implement with RabbitMQ or Redis when available
 * Currently commented out as eventEmitter is not yet implemented in context
 */

import { SubscriptionResolvers } from "@/server/graphql/types/generated";

// : Pick<SubscriptionResolvers, "companyCreated" | "companyUpdated" | "companyDeleted">
export const companySubscriptions = {};

// TODO: Uncomment subscriptions once eventEmitter is available

// export const companySubscriptions: SubscriptionResolvers = {
//   /**
//    * Subscribe to company updates (any field changes)
//    */
//   companyUpdated: withMiddleware(
//     {
//       subscribe: async (_parent, _args, context, _info) => {
//         return context.eventEmitter.asyncIterator(["COMPANY_UPDATED"]);
//       },
//       resolve: (payload: any) => payload,
//     },
//     { requireAuth: true, requiredPermissions: ["company:read"] }
//   ),
//
//   /**
//    * Subscribe to new company creation
//    */
//   companyCreated: withMiddleware(
//     {
//       subscribe: async (_parent, _args, context, _info) => {
//         return context.eventEmitter.asyncIterator(["COMPANY_CREATED"]);
//       },
//       resolve: (payload: any) => payload,
//     },
//     { requireAuth: true, requiredPermissions: ["company:read"] }
//   ),
//
//   /**
//    * Subscribe to company deletion
//    */
//   companyDeleted: withMiddleware(
//     {
//       subscribe: async (_parent, _args, context, _info) => {
//         return context.eventEmitter.asyncIterator(["COMPANY_DELETED"]);
//       },
//       resolve: (payload: any) => payload,
//     },
//     { requireAuth: true, requiredPermissions: ["company:read"] }
//   ),
// };

export default companySubscriptions;
