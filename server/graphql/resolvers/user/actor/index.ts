/**
 * ============================================================================
 * Actor Domain - Resolver Index
 * ============================================================================
 * Exports all actor resolvers (query, mutation, fields)
 * Used by the main resolver composition layer
 */

import actorFieldResolvers from "./fields";
import actorMutations from "./mutation";
import actorQueries from "./query";

/**
 * Complete resolver set for Actor domain
 * Combines and exports all resolver types
 */
export const actorResolvers = {
  Query: {
    actor: actorQueries.actor,
    myActor: actorQueries.myActor,
    actors: actorQueries.actors,
    companyActors: actorQueries.companyActors,
    departmentActors: actorQueries.departmentActors,
  },

  Mutation: {
    createActor: actorMutations.createActor,
    updateActor: actorMutations.updateActor,
    deactivateActor: actorMutations.deactivateActor,
    suspendActor: actorMutations.suspendActor,
    assignActorRole: actorMutations.assignActorRole,
    removeActorRole: actorMutations.removeActorRole,
    grantActorPermission: actorMutations.grantActorPermission,
    denyActorPermission: actorMutations.denyActorPermission,
    revokeActorPermission: actorMutations.revokeActorPermission,
  },

  Actor: actorFieldResolvers,
};

export { actorQueries, actorMutations, actorFieldResolvers };
export default actorResolvers;
