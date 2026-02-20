import { PrismaClient, Warehouse } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/common/BaseRepository";
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  WarehouseFilters,
} from "./types";

export class WarehouseRepository extends BaseRepository<
  Warehouse,
  CreateWarehouseInput,
  UpdateWarehouseInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "warehouse");
  }

  /**
   * Find warehouse by email
   */
  async findByEmail(email: string): Promise<Warehouse | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  /**
   * Find warehouses by city
   */
  async findByCity(city: string, skip = 0, take = 50): Promise<Warehouse[]> {
    return this.model.findMany({
      where: { city },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Find warehouses by state
   */
  async findByState(state: string, skip = 0, take = 50): Promise<Warehouse[]> {
    return this.model.findMany({
      where: { state },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Find warehouses by status
   */
  async findByStatus(
    status: string,
    skip = 0,
    take = 50,
  ): Promise<Warehouse[]> {
    return this.model.findMany({
      where: { status },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Find warehouses by capacity range
   */
  async findByCapacityRange(
    minCapacity: number,
    maxCapacity: number,
    skip = 0,
    take = 50,
  ): Promise<Warehouse[]> {
    return this.model.findMany({
      where: {
        capacity: {
          gte: minCapacity,
          lte: maxCapacity,
        },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Search warehouses by filters
   */
  async searchByFilters(
    filters: WarehouseFilters,
    skip = 0,
    take = 50,
  ): Promise<{ data: Warehouse[]; total: number }> {
    const where: any = {};

    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" as const };
    }
    if (filters.email) {
      where.email = { contains: filters.email, mode: "insensitive" as const };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.city) {
      where.city = { contains: filters.city, mode: "insensitive" as const };
    }
    if (filters.state) {
      where.state = { contains: filters.state, mode: "insensitive" as const };
    }
    if (filters.postalCode) {
      where.postalCode = filters.postalCode;
    }
    if (filters.minCapacity || filters.maxCapacity) {
      where.capacity = {
        ...(filters.minCapacity && { gte: filters.minCapacity }),
        ...(filters.maxCapacity && { lte: filters.maxCapacity }),
      };
    }

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" as const },
      }),
      this.model.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Count warehouses by status
   */
  async countByStatus(status: string): Promise<number> {
    return this.model.count({
      where: { status },
    });
  }

  /**
   * Update warehouse status (atomic)
   */
  async updateStatus(warehouseId: string, status: string): Promise<Warehouse> {
    return this.model.update({
      where: { id: warehouseId },
      data: { status, updatedAt: new Date() },
    });
  }
}
