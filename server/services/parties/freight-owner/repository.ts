import {
  PrismaClient,
  FreightOwner,
} from "@/server/db/generated/prisma/client";
import { FreightOwnerResponse } from "./types";

export class FreightOwnerRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<FreightOwnerResponse | null> {
    const owner = await this.prisma.freightOwner.findUnique({
      where: { id },
    });
    return owner ? this.mapToResponse(owner) : null;
  }

  async list(skip = 0, take = 10): Promise<FreightOwnerResponse[]> {
    const owners = await this.prisma.freightOwner.findMany({
      skip,
      take,
    });
    return owners.map((o) => this.mapToResponse(o));
  }

  async create(data: any): Promise<FreightOwnerResponse> {
    const owner = await this.prisma.freightOwner.create({ data });
    return this.mapToResponse(owner);
  }

  async update(id: string, data: any): Promise<FreightOwnerResponse> {
    const owner = await this.prisma.freightOwner.update({
      where: { id },
      data,
    });
    return this.mapToResponse(owner);
  }

  private mapToResponse(owner: FreightOwner): FreightOwnerResponse {
    return {
      id: owner.id,
      name: owner.companyName,
      email: owner.email,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
    };
  }
}
