/**
 * ============================================================================
 * Company Domain - Resolver Index
 * ============================================================================
 * Exports all company resolvers (query, mutation, fields, subscription)
 * Used by the main resolver composition layer
 */

import companyFieldResolvers from "./fields";
import companyMutations from "./mutation";
import companyQueries from "./query";
import companySubscriptions from "./subscription";

/**
 * Complete resolver set for Company domain
 * Combines and exports all resolver types
 */
export const companyResolvers = {
  Query: {
    company: companyQueries.company,
    myCompany: companyQueries.myCompany,
    companies: companyQueries.companies,
    companyBySlug: companyQueries.companyBySlug,
  },

  Mutation: {
    createCompany: companyMutations.createCompany,
    updateCompany: companyMutations.updateCompany,
  },

  Subscription: {
    ...companySubscriptions,
  },

  Company: companyFieldResolvers,
};

export {
  companyQueries,
  companyMutations,
  companySubscriptions,
  companyFieldResolvers,
};

export default companyResolvers;
