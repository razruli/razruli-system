// ═══════════════════════════════════════════════════════════════════════════════
// FREIGHT RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════
// Shipment coordinator for freight objects
// Phase 1: Owner creates freight and defines specs

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Freight Resolver
 *
 * Handles all freight-related queries, mutations, and field resolution
 * Freight: Physical cargo awaiting transport
 * Status: DRAFT → AVAILABLE → CLAIMED → ASSIGNED → COMPLETED
 *
 * Middleware applied via ResolverDependencies
 */
export class FreightResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Get single freight by ID
   * Usage: query getFreight($id: ID!) { getFreight(id: $id) { ... } }
   */
  getFreight = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.freightService.getFreight(args.id),
  );

  /**
   * List freights with pagination and filtering
   * Usage: query listFreights($input: PaginationInput) { listFreights(input: $input) { ... } }
   */
  listFreights = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.listFreights(
        args.input?.offset,
        args.input?.limit,
      ),
  );

  /**
   * List available freights (status = AVAILABLE)
   * Usage: query listAvailableFreights($input: PaginationInput) { listAvailableFreights(input: $input) { ... } }
   */
  listAvailableFreights = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.listAvailableFreights(
        args.input?.offset,
        args.input?.limit,
      ),
  );

  /**
   * Get freight by number
   * Usage: query getFreightByNumber($number: String!) { getFreightByNumber(number: $number) { ... } }
   */
  getFreightByNumber = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.getFreightByNumber(args.number),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  /**
   * Create new freight (Phase 1: Owner creates)
   * Usage: mutation createFreight($input: CreateFreightInput!) { createFreight(input: $input) { ... } }
   */
  createFreight = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.createFreight(args.input),
  );

  /**
   * Update freight details
   * Usage: mutation updateFreight($id: ID!, $input: UpdateFreightInput!) { updateFreight(id: $id, input: $input) { ... } }
   */
  updateFreight = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.updateFreight(args.id, args.input),
  );

  /**
   * Archive freight (soft delete)
   * Usage: mutation archiveFreight($id: ID!) { archiveFreight(id: $id) { ... } }
   */
  archiveFreight = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.archiveFreight(args.id),
  );

  /**
   * Claim freight lock (Phase 2: Broker claims)
   * Usage: mutation claimFreight($id: ID!, $brokerId: String!) { claimFreight(id: $id, brokerId: $brokerId) { ... } }
   */
  claimFreight = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.claimFreight(args.id, args.brokerId),
  );

  /**
   * Release freight claim (revert CLAIMED → AVAILABLE)
   * Usage: mutation releaseFreightClaim($id: ID!) { releaseFreightClaim(id: $id) { ... } }
   */
  releaseFreightClaim = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightService.releaseFreightClaim(args.id),
  );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  /**
   * Load freight owner (prevents N+1)
   */
  freightOwner = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.freightOwnerService.getFreightOwner(args.ownerId),
  );

  /**
   * Load broker (prevents N+1)
   */
  broker = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.brokerService.getBroker(args.brokerId),
  );

  /**
   * Load warehouse (prevents N+1)
   */
  currentWarehouse = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.warehouseService.getWarehouse(args.warehouseId),
  );
}
