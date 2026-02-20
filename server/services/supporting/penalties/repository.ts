import { PrismaClient } from "@/server/db/generated/prisma/client";

export class PenaltiesRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.penalty?.findUnique({ where: { id } }) ?? null;
  }

  async list(skip = 0, take = 10) {
    return this.prisma.penalty?.findMany({ skip, take }) ?? [];
  }

  async create(data: any) {
    return this.prisma.penalty?.create({ data }) ?? null;
  }

  async update(id: string, data: any) {
    return this.prisma.penalty?.update({ where: { id }, data }) ?? null;
  }
}
