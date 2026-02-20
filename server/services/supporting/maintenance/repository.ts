import { PrismaClient } from "@/server/db/generated/prisma/client";

export class MaintenanceRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.maintenance?.findUnique({ where: { id } }) ?? null;
  }

  async list(skip = 0, take = 10) {
    return this.prisma.maintenance?.findMany({ skip, take }) ?? [];
  }

  async create(data: any) {
    return this.prisma.maintenance?.create({ data }) ?? null;
  }

  async update(id: string, data: any) {
    return this.prisma.maintenance?.update({ where: { id }, data }) ?? null;
  }
}
