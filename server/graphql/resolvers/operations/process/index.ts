/**
 * ============================================================================
 * Process Domain - Resolver Index
 * ============================================================================
 * Exports all process resolvers (query, mutation, fields, subscription)
 */

import { processFieldResolvers, processMetricsFieldResolvers } from "./fields";
import processMutations from "./mutation";
import processQueries from "./query";
import processSubscriptions from "./subscription";

/**
 * Complete resolver set for Process domain
 */
export const processResolvers = {
  Query: {
    process: processQueries.process,
    processes: processQueries.processes,
    processTasks: processQueries.processTasks,
    processWithMetrics: processQueries.processWithMetrics,
    companyProcessMetrics: processQueries.companyProcessMetrics,
  },

  Mutation: {
    createProcess: processMutations.createProcess,
    updateProcess: processMutations.updateProcess,
    deleteProcess: processMutations.deleteProcess,
  },

  Subscription: {
    ...processSubscriptions,
  },

  Process: processFieldResolvers,
  ProcessMetrics: processMetricsFieldResolvers,
};

export {
  processQueries,
  processMutations,
  processSubscriptions,
  processFieldResolvers,
  processMetricsFieldResolvers,
};

export default processResolvers;
