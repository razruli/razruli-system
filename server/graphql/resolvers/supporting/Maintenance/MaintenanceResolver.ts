// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Maintenance Resolver
 * Thin routing layer - all logic delegated to MaintenanceService
 * Middleware applied via ResolverDependencies
 */
export class MaintenanceResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getMaintenanceRecord
   */
  getMaintenanceRecord = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.maintenanceService.getMaintenance(args.id),
  );

  /**
   * Query: listMaintenanceHistory
   */
  listMaintenanceHistory = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.maintenanceService.listMaintenance(args.skip, args.take),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Mutation: createMaintenanceRecord
   */
  createMaintenanceRecord = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.maintenanceService.createMaintenance(args.input),
  );
}

export default MaintenanceResolver;
