// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Rule #9: Audit Trail (Every action logged)

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Audit Resolver
 * Thin routing layer - all logic delegated to AuditService
 * Middleware applied via ResolverDependencies
 */
export class AuditResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES (read-only)
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getAuditLog
   */
  getAuditLog = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.auditService.getAudit(args.id),
  );

  /**
   * Query: listAuditLogs
   */
  listAuditLogs = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.auditService.listAudits(args.skip, args.take),
  );

  /**
   * Query: getShipmentAuditTrail
   */
  getShipmentAuditTrail = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.auditService.getShipmentEvents(args.shipmentId),
  );

  /**
   * Query: getFreightAuditTrail
   */
  getFreightAuditTrail = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.auditService.getShipmentEvents(args.freightId),
  );
}

export default AuditResolver;
