import { PrismaClient, Carrier } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/common/BaseRepository";
import {
  CreateCarrierInput,
  UpdateCarrierInput,
  CarrierFilters,
} from "./types";

export class CarrierRepository extends BaseRepository<
  Carrier,
  CreateCarrierInput,
  UpdateCarrierInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "carrier");
  }

  /**
   * Find carrier by email
   */
  async findByEmail(email: string): Promise<Carrier | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  /**
   * Find carrier by DOT number
   */
  async findByDotNumber(dotNumber: string): Promise<Carrier | null> {
    return this.model.findUnique({
      where: { dotNumber },
    });
  }

  /**
   * Find carrier by MC number
   */
  async findByMcNumber(mcNumber: string): Promise<Carrier | null> {
    return this.model.findUnique({
      where: { mcNumber },
    });
  }

  /**
   * Find carriers by city
   */
  async findByCity(city: string, skip = 0, take = 50): Promise<Carrier[]> {
    return this.model.findMany({
      where: { city },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Find carriers by status
   */
  async findByStatus(status: string, skip = 0, take = 50): Promise<Carrier[]> {
    return this.model.findMany({
      where: { status },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Search carriers by filters
   */
  async searchByFilters(
    filters: CarrierFilters,
    skip = 0,
    take = 50,
  ): Promise<{ data: Carrier[]; total: number }> {
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
    if (filters.dotNumber) {
      where.dotNumber = filters.dotNumber;
    }
    if (filters.minFleetSize || filters.maxFleetSize) {
      where.fleetSize = {
        ...(filters.minFleetSize && { gte: filters.minFleetSize }),
        ...(filters.maxFleetSize && { lte: filters.maxFleetSize }),
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
   * Count carriers by status
   */
  async countByStatus(status: string): Promise<number> {
    return this.model.count({
      where: { status },
    });
  }

  /**
   * Update carrier status (atomic)
   */
  async updateStatus(carrierId: string, status: string): Promise<Carrier> {
    return this.model.update({
      where: { id: carrierId },
      data: { status, updatedAt: new Date() },
    });
  }

  /**
   * Find carriers by minimum rating
   */
  async findByMinRating(
    minRating: number,
    skip = 0,
    take = 50,
  ): Promise<Carrier[]> {
    return this.model.findMany({
      where: {
        rating: { gte: minRating },
      },
      skip,
      take,
      orderBy: { rating: "desc" as const },
    });
  }
}
