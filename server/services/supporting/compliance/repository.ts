import { PrismaClient } from "@/server/db/generated/prisma/client";

export class ComplianceRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.compliance?.findUnique({ where: { id } }) ?? null;
  }

  async list(skip = 0, take = 10) {
    return this.prisma.compliance?.findMany({ skip, take }) ?? [];
  }

  async create(data: any) {
    return this.prisma.compliance?.create({ data }) ?? null;
  }

  async update(id: string, data: any) {
    return this.prisma.compliance?.update({ where: { id }, data }) ?? null;
  }
}
