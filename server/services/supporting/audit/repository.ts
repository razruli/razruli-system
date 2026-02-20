import { PrismaClient } from "@/server/db/generated/prisma/client";

export class AuditRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.auditLog?.findUnique({ where: { id } }) ?? null;
  }

  async list(skip = 0, take = 10) {
    return this.prisma.auditLog?.findMany({ skip, take }) ?? [];
  }

  async create(data: any) {
    return this.prisma.auditLog?.create({ data }) ?? null;
  }

  async update(id: string, data: any) {
    return this.prisma.auditLog?.update({ where: { id }, data }) ?? null;
  }

  async findByShipmentId(shipmentId: string) {
    return (
      (await this.prisma.auditLog?.findMany({
        where: { shipmentId },
      })) ?? []
    );
  }
}
