/**
 * Dataloader for batching shipment bids queries
 * Prevents N+1 queries when resolving bids for multiple shipments
 */

import DataLoader from "dataloader";

import prisma from "@/server/db/prisma/lib/prisma";

// NOTE: Bid model is defined in schema but may require migration
// If Bid model not available, this will return empty arrays until migration is run

export class ShipmentBidsLoader {
  private loader: DataLoader<string, any[]>;

  constructor() {
    this.loader = new DataLoader(async (shipmentIds: readonly string[]) => {
      try {
        // Fetch all bids for the given shipments
        // Using 'any' due to Prisma client generation timing
        const bids = await (prisma as any).bid?.findMany({
          where: {
            shipmentId: {
              in: shipmentIds as string[],
            },
          },
        });

        if (!bids) {
          // Model not available yet (migration pending)
          return shipmentIds.map(() => []);
        }

        // Group bids by shipment ID
        const bidsMap = new Map<string, any[]>();
        shipmentIds.forEach((id) => bidsMap.set(id, []));

        bids.forEach((bid: any) => {
          const bidList = bidsMap.get(bid.shipmentId);
          if (bidList) {
            bidList.push(bid);
          }
        });

        // Return arrays in same order as requested shipment IDs
        return shipmentIds.map((id) => bidsMap.get(id) || []);
      } catch (error) {
        // Graceful fallback if Bid model not yet migrated
        console.warn("ShipmentBidsLoader: Bid model not available yet", error);
        return shipmentIds.map(() => []);
      }
    });
  }

  load(shipmentId: string) {
    return this.loader.load(shipmentId);
  }

  loadMany(shipmentIds: string[]) {
    return this.loader.loadMany(shipmentIds);
  }
}
