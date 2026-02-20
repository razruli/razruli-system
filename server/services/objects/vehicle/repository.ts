import { PrismaClient } from "@/server/db/generated/prisma/client";
import { VehicleResponse } from "./types";

export class VehicleRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<VehicleResponse | null> {
    return this.prisma.truck.findUnique({
      where: { id },
    }) as Promise<VehicleResponse | null>;
  }

  async listByCarrier(carrierId: string): Promise<VehicleResponse[]> {
    return this.prisma.truck.findMany({
      where: { carrierId },
      orderBy: { createdAt: "desc" },
    }) as Promise<VehicleResponse[]>;
  }

  async list(skip = 0, take = 10): Promise<VehicleResponse[]> {
    return this.prisma.truck.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }) as Promise<VehicleResponse[]>;
  }

  async create(data: any): Promise<VehicleResponse> {
    return this.prisma.truck.create({
      data,
    }) as Promise<VehicleResponse>;
  }

  async update(id: string, data: any): Promise<VehicleResponse> {
    return this.prisma.truck.update({
      where: { id },
      data,
    }) as Promise<VehicleResponse>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.truck.delete({
      where: { id },
    });
  }
}
