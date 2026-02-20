import { PrismaClient } from "@/server/db/generated/prisma/client";

export class ReviewsRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.review?.findUnique({ where: { id } }) ?? null;
  }

  async list(skip = 0, take = 10) {
    return this.prisma.review?.findMany({ skip, take }) ?? [];
  }

  async create(data: any) {
    return this.prisma.review?.create({ data }) ?? null;
  }

  async update(id: string, data: any) {
    return this.prisma.review?.update({ where: { id }, data }) ?? null;
  }
}
