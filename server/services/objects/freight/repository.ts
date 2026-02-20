import { PrismaClient, Freight } from "@/server/db/generated/prisma/client";
import {
  FreightResponse,
  CreateFreightInput,
  UpdateFreightInput,
  FreightFilters,
} from "./types";

export class FreightRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<FreightResponse | null> {
    const freight = await this.prisma.freight.findUnique({
      where: { id },
      include: {
        freightOwner: true,
        broker: true,
        currentWarehouse: true,
      },
    });
    return freight ? this.mapToResponse(freight) : null;
  }

  async findByFreightNumber(
    freightNumber: string,
  ): Promise<FreightResponse | null> {
    const freight = await this.prisma.freight.findUnique({
      where: { freightNumber },
      include: {
        freightOwner: true,
        broker: true,
        currentWarehouse: true,
      },
    });
    return freight ? this.mapToResponse(freight) : null;
  }

  async search(
    filters: FreightFilters,
    skip = 0,
    take = 10,
  ): Promise<FreightResponse[]> {
    const freights = await this.prisma.freight.findMany({
      where: {
        ...(filters.freightOwnerId && {
          freightOwnerId: filters.freightOwnerId,
        }),
        ...(filters.brokerId && { brokerId: filters.brokerId }),
        ...(filters.status && { status: filters.status as any }),
        ...(filters.isHazmat !== undefined && { isHazmat: filters.isHazmat }),
        ...(filters.isFragile !== undefined && {
          isFragile: filters.isFragile,
        }),
        ...(filters.isPerishable !== undefined && {
          isPerishable: filters.isPerishable,
        }),
      },
      skip,
      take,
      include: {
        freightOwner: true,
        broker: true,
        currentWarehouse: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return freights.map((f) => this.mapToResponse(f));
  }

  async listAvailableFreights(): Promise<FreightResponse[]> {
    const freights = await this.prisma.freight.findMany({
      where: { status: "available" },
      include: {
        freightOwner: true,
        broker: true,
        currentWarehouse: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return freights.map((f) => this.mapToResponse(f));
  }

  async list(skip = 0, take = 10): Promise<FreightResponse[]> {
    const freights = await this.prisma.freight.findMany({
      skip,
      take,
      include: {
        freightOwner: true,
        broker: true,
        currentWarehouse: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return freights.map((f) => this.mapToResponse(f));
  }

  async create(input: CreateFreightInput): Promise<FreightResponse> {
    const freight = await this.prisma.freight.create({
      data: {
        freightNumber: `FRT-${Date.now()}`,
        freightOwnerId: input.freightOwnerId,
        productName: input.productName,
        productDescription: input.productDescription,
        productType: input.productType,
        hsCode: input.hsCode,
        unitType: input.unitType || "pieces",
        quantity: input.quantity,
        unitWeight: input.unitWeight,
        totalWeight: input.totalWeight,
        length: input.length,
        width: input.width,
        height: input.height,
        volume: input.volume,
        isHazmat: input.isHazmat || false,
        hazmatClass: input.hazmatClass,
        hazmatUNNumber: input.hazmatUNNumber,
        hazmatDescription: input.hazmatDescription,
        isFragile: input.isFragile || false,
        isPerishable: input.isPerishable || false,
        temperatureMin: input.temperatureMin,
        temperatureMax: input.temperatureMax,
        isValueable: input.isValueable || false,
        declaredValue: input.declaredValue,
        requiresHandling: input.requiresHandling || [],
        status: "draft",
      },
      include: {
        freightOwner: true,
        broker: true,
        currentWarehouse: true,
      },
    });
    return this.mapToResponse(freight);
  }

  async update(
    id: string,
    input: UpdateFreightInput,
  ): Promise<FreightResponse> {
    const freight = await this.prisma.freight.update({
      where: { id },
      data: {
        ...(input.productName && { productName: input.productName }),
        ...(input.productDescription && {
          productDescription: input.productDescription,
        }),
        ...(input.productType && { productType: input.productType }),
        ...(input.hsCode && { hsCode: input.hsCode }),
        ...(input.quantity && { quantity: input.quantity }),
        ...(input.unitWeight && { unitWeight: input.unitWeight }),
        ...(input.totalWeight && { totalWeight: input.totalWeight }),
        ...(input.length && { length: input.length }),
        ...(input.width && { width: input.width }),
        ...(input.height && { height: input.height }),
        ...(input.volume && { volume: input.volume }),
        ...(input.isHazmat !== undefined && { isHazmat: input.isHazmat }),
        ...(input.hazmatClass && { hazmatClass: input.hazmatClass }),
        ...(input.hazmatUNNumber && { hazmatUNNumber: input.hazmatUNNumber }),
        ...(input.hazmatDescription && {
          hazmatDescription: input.hazmatDescription,
        }),
        ...(input.isFragile !== undefined && { isFragile: input.isFragile }),
        ...(input.isPerishable !== undefined && {
          isPerishable: input.isPerishable,
        }),
        ...(input.temperatureMin && { temperatureMin: input.temperatureMin }),
        ...(input.temperatureMax && { temperatureMax: input.temperatureMax }),
        ...(input.isValueable !== undefined && {
          isValueable: input.isValueable,
        }),
        ...(input.declaredValue && { declaredValue: input.declaredValue }),
        ...(input.requiresHandling && {
          requiresHandling: input.requiresHandling,
        }),
        ...(input.status && { status: input.status }),
      },
      include: {
        freightOwner: true,
        broker: true,
        currentWarehouse: true,
      },
    });
    return this.mapToResponse(freight);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.freight.delete({ where: { id } });
  }

  private mapToResponse(freight: Freight): FreightResponse {
    return {
      id: freight.id,
      freightNumber: freight.freightNumber,
      freightOwnerId: freight.freightOwnerId,
      brokerId: freight.brokerId,
      productName: freight.productName,
      productDescription: freight.productDescription,
      productType: freight.productType,
      hsCode: freight.hsCode,
      unitType: freight.unitType,
      quantity: freight.quantity,
      unitWeight: freight.unitWeight,
      totalWeight: freight.totalWeight,
      length: freight.length,
      width: freight.width,
      height: freight.height,
      volume: freight.volume,
      isHazmat: freight.isHazmat,
      hazmatClass: freight.hazmatClass,
      hazmatUNNumber: freight.hazmatUNNumber,
      hazmatDescription: freight.hazmatDescription,
      isFragile: freight.isFragile,
      isPerishable: freight.isPerishable,
      temperatureMin: freight.temperatureMin,
      temperatureMax: freight.temperatureMax,
      isValueable: freight.isValueable,
      declaredValue: freight.declaredValue,
      requiresHandling: freight.requiresHandling,
      currentWarehouseId: freight.currentWarehouseId,
      storageStartDate: freight.storageStartDate,
      storageEndDate: freight.storageEndDate,
      status: freight.status,
      createdAt: freight.createdAt,
      updatedAt: freight.updatedAt,
    };
  }
}
