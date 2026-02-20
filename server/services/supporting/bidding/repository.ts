import { PrismaClient } from "@/server/db/generated/prisma/client";

export class BiddingRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.bid?.findUnique({ where: { id } }) ?? null;
  }

  async list(skip = 0, take = 10) {
    return this.prisma.bid?.findMany({ skip, take }) ?? [];
  }

  async create(data: any) {
    return this.prisma.bid?.create({ data }) ?? null;
  }

  async update(id: string, data: any) {
    return this.prisma.bid?.update({ where: { id }, data }) ?? null;
  }

  async listByShipment(shipmentId: string, skip = 0, take = 50) {
    return (
      (await this.prisma.bid?.findMany({
        where: { shipmentId },
        skip,
        take,
      })) ?? []
    );
  }
}
