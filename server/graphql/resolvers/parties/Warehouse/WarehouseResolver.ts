// ═══════════════════════════════════════════════════════════════════════════════
// WAREHOUSE RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Warehouse Resolver
 * Thin routing layer - all logic delegated to WarehouseService
 * Middleware applied via ResolverDependencies
 */
export class WarehouseResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  /**
   * Query: getWarehouse
   */
  getWarehouse = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.warehouseService.getWarehouse(args.id),
  );

  /**
   * Query: listWarehouses
   */
  listWarehouses = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.warehouseService.searchWarehouses(
        args.filters || {},
        args.skip,
        args.take,
      ),
  );

  /**
   * Query: searchWarehouses
   */
  searchWarehouses = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.warehouseService.searchWarehouses(
        args.filters,
        args.skip,
        args.take,
      ),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  // /**
  //  * Mutation: createWarehouse
  //  */
  // createWarehouse = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.warehouseService.createWarehouse(args.input),
  // );

  // /**
  //  * Mutation: updateWarehouse
  //  */
  // updateWarehouse = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.warehouseService.updateWarehouse(args.id, args.input),
  // );

  // /**
  //  * Mutation: updateCapacity
  //  */
  // updateCapacity = this.deps.composeMutation(
  //   async (args: any, ctx: GraphQLContext) =>
  //     ctx.services.warehouseService.updateWarehouse(args.id, {
  //       capacity: args.capacity,
  //     }),
  // );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  /**
   * Field: parent (parent company/organization)
   */
  parent = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.userService.getCurrentUser(args.parentId),
  );
}

export default WarehouseResolver;
