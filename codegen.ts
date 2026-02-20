// codegen.ts
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    "server/graphql/schema/scalars.graphql",
    "server/graphql/schema/index.graphql",
    "server/graphql/schema/**/*.graphql",
    "server/graphql/resolvers/**/*.graphql",
  ],
  documents: "shared/graphql/client/**/*.graphql",

  generates: {
    // =========================
    // Server types (resolvers)
    // =========================
    "server/graphql/types/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#GraphQLContext",
        avoidOptionals: true,
        resolverValidationOptions: {
          requireResolversForResolveType: false,
          requireResolversForAllFields: false,
        },
        mappers: {
          User: "../../db/generated/prisma/models#UserModel",
          FreightOwner: "../../db/generated/prisma/models#FreightOwnerModel",
          Broker: "../../db/generated/prisma/models#BrokerModel",
          Carrier: "../../db/generated/prisma/models#CarrierModel",
          Warehouse: "../../db/generated/prisma/models#WarehouseModel",
          Driver: "../../db/generated/prisma/models#DriverModel",
          Freight: "../../db/generated/prisma/models#FreightModel",
          Shipment: "../../db/generated/prisma/models#ShipmentModel",
          Truck: "../../db/generated/prisma/models#TruckModel",
          Bid: "../../db/generated/prisma/models#ShipmentBidModel",
          BidRule: "../../db/generated/prisma/models#BidRuleModel",
          BidRequirement:
            "../../db/generated/prisma/models#BidRequirementModel",
          WarehouseNeed: "../../db/generated/prisma/models#WarehouseNeedModel",
          WarehouseBid: "../../db/generated/prisma/models#WarehouseBidModel",
        },
        scalars: {
          DateTime: "Date",
          JSON: "Record<string, any>",
          BigInt: "bigint",
        },
        strictScalars: false,
      },
    },

    // =========================
    // Client types (preset: client)
    // =========================
    "shared/graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false, // ✅ explicitly disabled
      },
      config: {
        scalars: {
          DateTime: "Date", // Prisma Date
          JSON: "Record<string, any>",
          BigInt: "bigint",
        },
      },
    },
  },

  hooks: {
    // afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
