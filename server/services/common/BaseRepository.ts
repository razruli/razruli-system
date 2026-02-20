import { PrismaClient } from "@/server/db/generated/prisma/client";
import { FindManyOptions } from "./types";

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected modelName: keyof PrismaClient;

  constructor(
    protected prisma: PrismaClient,
    modelName: keyof PrismaClient,
  ) {
    this.modelName = modelName;
  }

  protected get model() {
    return this.prisma[this.modelName] as any;
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  async findMany(options: FindManyOptions<T>): Promise<T[]> {
    return this.model.findMany(options);
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where: where || {} });
  }

  async create(input: CreateInput, include?: any): Promise<T> {
    return this.model.create({
      data: input,
      include,
    });
  }

  async update(
    id: string,
    input: UpdateInput,
    include?: any,
  ): Promise<T | null> {
    return this.model.update({
      where: { id },
      data: input,
      include,
    });
  }

  async upsert(
    where: any,
    createInput: CreateInput,
    updateInput: UpdateInput,
    include?: any,
  ): Promise<T> {
    return this.model.upsert({
      where,
      create: createInput,
      update: updateInput,
      include,
    });
  }

  async delete(id: string): Promise<T | null> {
    return this.model.delete({
      where: { id },
    });
  }

  async deleteMany(where?: any): Promise<{ count: number }> {
    return this.model.deleteMany({ where: where || {} });
  }

  async updateMany(where: any, data: UpdateInput): Promise<{ count: number }> {
    return this.model.updateMany({ where, data });
  }
}
