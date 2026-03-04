/**
 * ============================================================================
 * MAIN SUBSCRIPTION RESOLVER
 * ============================================================================
 * Unified composition of all domain subscription resolvers
 * Imports and composes subscriptions from:
 * - Core domain (company, department, employee, grade)
 * - Operations domain (process, taskAssignment)
 * - Analytics domain (gapAnalysis, loadSnapshot)
 * - Audit domain (auditLog, employeeHistory)
 * - User domain
 *
 * NOTE: Subscriptions are currently empty (TODO) but reserved for future
 * implementation with RabbitMQ or Redis event emitter
 */

import { SubscriptionResolvers } from "../types/generated";

import { analyticsResolvers } from "./analytics";
import { auditResolvers } from "./audit";
import { coreResolvers } from "./core";
import { operationsResolvers } from "./operations";

/**
 * Unified Subscription resolver
 * Combines all domain-specific subscription resolvers
 *
 * Currently mostly empty as we await eventEmitter implementation
 * TODO: Implement real-time subscriptions once RabbitMQ/Redis is available
 */
export const subscriptionResolver: SubscriptionResolvers = {
  // Core domain subscriptions
  ...coreResolvers.Subscription,

  // Operations domain subscriptions
  ...operationsResolvers.Subscription,

  // Analytics domain subscriptions
  ...analyticsResolvers.Subscription,

  // Audit domain subscriptions
  ...auditResolvers.Subscription,
};

export default subscriptionResolver;
