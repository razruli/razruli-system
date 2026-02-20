import { PrismaClient, Broker } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/common/BaseRepository";
import { CreateBrokerInput, UpdateBrokerInput, BrokerFilters } from "./types";

export class BrokerRepository extends BaseRepository<
  Broker,
  CreateBrokerInput,
  UpdateBrokerInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma, "broker");
  }

  /**
   * Find broker by email
   */
  async findByEmail(email: string): Promise<Broker | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  /**
   * Find broker by license number
   */
  async findByLicenseNumber(licenseNumber: string): Promise<Broker | null> {
    return this.model.findUnique({
      where: { licenseNumber },
    });
  }

  /**
   * Find brokers by city
   */
  async findByCity(city: string, skip = 0, take = 50): Promise<Broker[]> {
    return this.model.findMany({
      where: { city },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Find brokers by status
   */
  async findByStatus(status: string, skip = 0, take = 50): Promise<Broker[]> {
    return this.model.findMany({
      where: { status },
      skip,
      take,
      orderBy: { createdAt: "desc" as const },
    });
  }

  /**
   * Search brokers by filters
   */
  async searchByFilters(
    filters: BrokerFilters,
    skip = 0,
    take = 50,
  ): Promise<{ data: Broker[]; total: number }> {
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
    if (filters.licenseNumber) {
      where.licenseNumber = filters.licenseNumber;
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
   * Count brokers by status
   */
  async countByStatus(status: string): Promise<number> {
    return this.model.count({
      where: { status },
    });
  }

  /**
   * Update broker status (atomic)
   */
  async updateStatus(brokerId: string, status: string): Promise<Broker> {
    return this.model.update({
      where: { id: brokerId },
      data: { status, updatedAt: new Date() },
    });
  }
}
