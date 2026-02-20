import DataLoader from "dataloader";
import { PrismaClient } from "@/server/db/generated/prisma/client";

import { LoaderRegistry } from "@/server/services/common/BaseService";

/**
 * Create fresh DataLoader factories for each request
 * Each factory is called when needed: loaders.user()
 * This ensures no cache pollution across requests
 */
export function createLoaders(prisma: PrismaClient): LoaderRegistry {
  return {
    /**
     * Batch load users by ID
     */
    user: () =>
      new DataLoader<string, any>(async (userIds) => {
        return Promise.all(
          userIds.map((id) =>
            prisma.user
              .findUnique({ where: { id } })
              .then((user) => user || new Error(`User not found: ${id}`)),
          ),
        );
      }),

    /**
     * Batch load brokers by ID
     */
    broker: () =>
      new DataLoader<string, any>(async (brokerIds) => {
        return Promise.all(
          brokerIds.map((id) =>
            prisma.broker
              .findUnique({ where: { id } })
              .then((broker) => broker || new Error(`Broker not found: ${id}`)),
          ),
        );
      }),

    /**
     * Batch load carriers by ID
     */
    carrier: () =>
      new DataLoader<string, any>(async (carrierIds) => {
        return Promise.all(
          carrierIds.map((id) =>
            prisma.carrier
              .findUnique({ where: { id } })
              .then(
                (carrier) => carrier || new Error(`Carrier not found: ${id}`),
              ),
          ),
        );
      }),

    /**
     * Batch load warehouses by ID
     */
    warehouse: () =>
      new DataLoader<string, any>(async (warehouseIds) => {
        return Promise.all(
          warehouseIds.map((id) =>
            prisma.warehouse
              .findUnique({ where: { id } })
              .then(
                (warehouse) =>
                  warehouse || new Error(`Warehouse not found: ${id}`),
              ),
          ),
        );
      }),

    /**
     * Batch load drivers by ID
     */
    driver: () =>
      new DataLoader<string, any>(async (driverIds) => {
        return Promise.all(
          driverIds.map((id) =>
            prisma.driver
              .findUnique({ where: { id } })
              .then((driver) => driver || new Error(`Driver not found: ${id}`)),
          ),
        );
      }),

    /**
     * Batch load freight by ID
     */
    freight: () =>
      new DataLoader<string, any>(async (freightIds) => {
        return Promise.all(
          freightIds.map((id) =>
            prisma.freight
              .findUnique({ where: { id } })
              .then(
                (freight) => freight || new Error(`Freight not found: ${id}`),
              ),
          ),
        );
      }),

    /**
     * Batch load shipments by ID
     */
    shipment: () =>
      new DataLoader<string, any>(async (shipmentIds) => {
        return Promise.all(
          shipmentIds.map((id) =>
            prisma.shipment
              .findUnique({ where: { id } })
              .then(
                (shipment) =>
                  shipment || new Error(`Shipment not found: ${id}`),
              ),
          ),
        );
      }),
  };
}

export type { LoaderRegistry } from "@/server/services/common/BaseService";
