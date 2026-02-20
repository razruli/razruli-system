import { usersResultFieldResolvers } from "./user";

// Import field resolvers individually to avoid conflicts
import * as FreightFields from "./objects/Freight/fields";
import * as ShipmentFields from "./objects/Shipment/fields";
import * as VehicleFields from "./objects/Vehicle/fields";
import * as CarrierFields from "./parties/Carrier/fields";
import * as BrokerFields from "./parties/Broker/fields";
import * as DriverFields from "./parties/Driver/fields";
import * as FreightOwnerFields from "./parties/FreightOwner/fields";
import * as WarehouseFields from "./parties/Warehouse/fields";
import * as BiddingFields from "./supporting/Bidding/fields";
import * as ContractsFields from "./supporting/Contracts/fields";
import * as JunctionsFields from "./supporting/Junctions/fields";
import * as PageFields from "./supporting/page/fields";

export const typeResolvers = {
  // Auth type resolvers
  UsersResult: usersResultFieldResolvers,

  // Objects type field resolvers
  ...FreightFields,
  ...ShipmentFields,
  ...VehicleFields,

  // Parties type field resolvers
  ...CarrierFields,
  ...BrokerFields,
  ...DriverFields,
  ...FreightOwnerFields,
  ...WarehouseFields,

  // Supporting type field resolvers
  ...BiddingFields,
  ...ContractsFields,
  ...JunctionsFields,
  ...PageFields,
};
