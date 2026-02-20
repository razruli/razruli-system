// ═══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Compliance Resolver
 * Thin routing layer - all logic delegated to ComplianceService
 * Middleware applied via ResolverDependencies
 */
export class ComplianceResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getComplianceStatus
   */
  getComplianceStatus = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.complianceService.getCompliance(args.carrierId),
  );

  /**
   * Query: listComplianceIssues
   */
  listComplianceIssues = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.complianceService.listCompliance(args.skip, args.take),
  );
}

export default ComplianceResolver;
