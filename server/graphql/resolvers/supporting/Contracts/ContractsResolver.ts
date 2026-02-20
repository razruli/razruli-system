// ═══════════════════════════════════════════════════════════════════════════════
// CONTRACTS RESOLVER CLASS
// ═══════════════════════════════════════════════════════════════════════════════

import { BaseResolver } from "@/server/graphql/lib/base-resolver";
import { GraphQLContext } from "@/server/graphql/context";
import {
  ResolverDependencies,
  applyMiddleware,
} from "@/server/graphql/lib/ResolverDependencies";

/**
 * Contracts Resolver
 * Thin routing layer - all logic delegated to ContractsService
 * Middleware applied via ResolverDependencies
 */
export class ContractsResolver extends BaseResolver<GraphQLContext> {
  constructor(private deps: ResolverDependencies) {
    super();
  }

  // ═════════════════════════════════════════════════════════════
  // QUERIES
  // ═════════════════════════════════════════════════════════════

  getBrokerCarrierContract = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.getBrokerCarrierContract(args.id),
  );

  listBrokerCarrierContracts = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.listBrokerCarrierContracts(args.brokerId),
  );

  getBrokerRate = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.getBrokerRate(args.id),
  );

  listBrokerRates = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.listBrokerRates(args.contractId),
  );

  getCarrierRate = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.getCarrierRate(args.id),
  );

  listCarrierRates = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.listCarrierRates(args.carrierId),
  );

  getCarrierAccessorial = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.getCarrierAccessorial(args.id),
  );

  listCarrierAccessorials = this.deps.composeQuery(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.listCarrierAccessorials(args.carrierId),
  );

  // ═════════════════════════════════════════════════════════════
  // MUTATIONS
  // ═════════════════════════════════════════════════════════════

  createBrokerCarrierContract = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.createBrokerCarrierContract(args.input),
  );

  updateBrokerCarrierContract = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.updateBrokerCarrierContract(
        args.id,
        args.input,
      ),
  );

  createBrokerRate = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.createBrokerRate(args.input),
  );

  updateBrokerRate = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.updateBrokerRate(args.id, args.input),
  );

  createCarrierRate = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.createCarrierRate(args.input),
  );

  updateCarrierRate = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.updateCarrierRate(args.id, args.input),
  );

  createCarrierAccessorial = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.createCarrierAccessorial(args.input),
  );

  updateCarrierAccessorial = this.deps.composeMutation(
    async (args: any, ctx: GraphQLContext) =>
      ctx.services.contractsService.updateCarrierAccessorial(
        args.id,
        args.input,
      ),
  );

  // ═════════════════════════════════════════════════════════════
  // FIELD RESOLVERS
  // ═════════════════════════════════════════════════════════════

  contract = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.contractsService.getBrokerCarrierContract(args.contractId),
  );

  rates = this.deps.composeQuery(async (args: any, ctx: GraphQLContext) =>
    ctx.services.contractsService.listBrokerRates(args.contractId),
  );
}

export default ContractsResolver;
