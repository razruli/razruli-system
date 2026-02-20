import { PrismaClient, Shipment } from "@/server/db/generated/prisma/client";
import {
  ShipmentResponse,
  CreateShipmentInput,
  UpdateShipmentInput,
  ShipmentFilters,
} from "./types";

export class ShipmentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<ShipmentResponse | null> {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
    });
    return shipment ? this.mapToResponse(shipment) : null;
  }

  async findByShipmentNumber(
    shipmentNumber: string,
  ): Promise<ShipmentResponse | null> {
    const shipment = await this.prisma.shipment.findUnique({
      where: { shipmentNumber },
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
    });
    return shipment ? this.mapToResponse(shipment) : null;
  }

  async listByFreightOwner(
    freightOwnerId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentResponse[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: { freightOwnerId },
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return shipments.map((s) => this.mapToResponse(s));
  }

  async search(
    filters: ShipmentFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentResponse[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: {
        ...(filters.status && { status: filters.status as any }),
        ...(filters.brokerId && { brokerId: filters.brokerId }),
        ...(filters.carrierId && { carrierId: filters.carrierId }),
        ...(filters.freightOwnerId && {
          freightOwnerId: filters.freightOwnerId,
        }),
        ...(filters.startDate && { createdAt: { gte: filters.startDate } }),
        ...(filters.endDate && { createdAt: { lte: filters.endDate } }),
      },
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return shipments.map((s) => this.mapToResponse(s));
  }

  async list(skip = 0, take = 10): Promise<ShipmentResponse[]> {
    const shipments = await this.prisma.shipment.findMany({
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return shipments.map((s) => this.mapToResponse(s));
  }

  async create(data: CreateShipmentInput): Promise<ShipmentResponse> {
    const shipment = await this.prisma.shipment.create({
      data: {
        shipmentNumber: data.shipmentNumber,
        freightOwnerId: data.freightOwnerId,
        brokerId: data.brokerId,
        carrierId: data.carrierId,
        driverId: data.driverId,
        truckId: data.truckId,
        originWarehouseId: data.originWarehouseId,
        destinationWarehouseId: data.destinationWarehouseId,
        pickupScheduled: data.pickupScheduled,
        pickupActual: data.pickupActual,
        deliveryScheduled: data.deliveryScheduled,
        deliveryActual: data.deliveryActual,
        ownerBudget: data.ownerBudget,
        brokerMarginPercent: data.brokerMarginPercent,
        brokerMarginAmount: data.brokerMarginAmount,
        baseRate: data.baseRate,
        surchargeRate: data.surchargeRate,
        fuelSurcharge: data.fuelSurcharge,
        fuelSurchargeAmount: data.fuelSurchargeAmount,
        marketAdjustment: data.marketAdjustment,
        customerRate: data.customerRate,
        carrierRate: data.carrierRate,
        distance: data.distance,
        estimatedOD: data.estimatedOD,
        actualOD: data.actualOD,
        status: data.status,
      },
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
    });
    return this.mapToResponse(shipment);
  }

  async update(
    id: string,
    data: UpdateShipmentInput,
  ): Promise<ShipmentResponse> {
    const updateData: any = {};
    if (data.carrierId !== undefined) updateData.carrierId = data.carrierId;
    if (data.driverId !== undefined) updateData.driverId = data.driverId;
    if (data.truckId !== undefined) updateData.truckId = data.truckId;
    if (data.destinationWarehouseId !== undefined)
      updateData.destinationWarehouseId = data.destinationWarehouseId;
    if (data.pickupActual !== undefined)
      updateData.pickupActual = data.pickupActual;
    if (data.deliveryActual !== undefined)
      updateData.deliveryActual = data.deliveryActual;
    if (data.baseRate !== undefined) updateData.baseRate = data.baseRate;
    if (data.surchargeRate !== undefined)
      updateData.surchargeRate = data.surchargeRate;
    if (data.fuelSurcharge !== undefined)
      updateData.fuelSurcharge = data.fuelSurcharge;
    if (data.fuelSurchargeAmount !== undefined)
      updateData.fuelSurchargeAmount = data.fuelSurchargeAmount;
    if (data.marketAdjustment !== undefined)
      updateData.marketAdjustment = data.marketAdjustment;
    if (data.customerRate !== undefined)
      updateData.customerRate = data.customerRate;
    if (data.carrierRate !== undefined)
      updateData.carrierRate = data.carrierRate;
    if (data.estimatedRevenue !== undefined)
      updateData.estimatedRevenue = data.estimatedRevenue;
    if (data.estimatedCost !== undefined)
      updateData.estimatedCost = data.estimatedCost;
    if (data.estimatedMargin !== undefined)
      updateData.estimatedMargin = data.estimatedMargin;
    if (data.actualRevenue !== undefined)
      updateData.actualRevenue = data.actualRevenue;
    if (data.actualCost !== undefined) updateData.actualCost = data.actualCost;
    if (data.actualMargin !== undefined)
      updateData.actualMargin = data.actualMargin;
    if (data.distance !== undefined) updateData.distance = data.distance;
    if (data.estimatedOD !== undefined)
      updateData.estimatedOD = data.estimatedOD;
    if (data.actualOD !== undefined) updateData.actualOD = data.actualOD;
    if (data.status !== undefined) updateData.status = data.status;

    const shipment = await this.prisma.shipment.update({
      where: { id },
      data: updateData,
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
    });
    return this.mapToResponse(shipment);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shipment.delete({
      where: { id },
    });
  }

  async listByBroker(
    brokerId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentResponse[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: { brokerId },
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return shipments.map((s) => this.mapToResponse(s));
  }

  async listByCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentResponse[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: { carrierId },
      include: {
        freightOwner: true,
        broker: true,
        carrier: true,
        driver: true,
        truck: true,
        originWarehouse: true,
        destinationWarehouse: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return shipments.map((s) => this.mapToResponse(s));
  }

  private mapToResponse(shipment: Shipment): ShipmentResponse {
    return {
      id: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      freightOwnerId: shipment.freightOwnerId,
      brokerId: shipment.brokerId,
      carrierId: shipment.carrierId,
      driverId: shipment.driverId,
      truckId: shipment.truckId,
      originWarehouseId: shipment.originWarehouseId,
      destinationWarehouseId: shipment.destinationWarehouseId,
      pickupScheduled: shipment.pickupScheduled,
      pickupActual: shipment.pickupActual,
      deliveryScheduled: shipment.deliveryScheduled,
      deliveryActual: shipment.deliveryActual,
      ownerBudget: shipment.ownerBudget,
      brokerMarginPercent: shipment.brokerMarginPercent,
      brokerMarginAmount: shipment.brokerMarginAmount,
      biddingOpenedAt: shipment.biddingOpenedAt,
      biddingOpenUntil: shipment.biddingOpenUntil,
      acceptedBidId: shipment.acceptedBidId,
      baseRate: shipment.baseRate,
      surchargeRate: shipment.surchargeRate,
      fuelSurcharge: shipment.fuelSurcharge,
      fuelSurchargeAmount: shipment.fuelSurchargeAmount,
      marketAdjustment: shipment.marketAdjustment,
      customerRate: shipment.customerRate,
      carrierRate: shipment.carrierRate,
      estimatedRevenue: shipment.estimatedRevenue,
      estimatedCost: shipment.estimatedCost,
      estimatedMargin: shipment.estimatedMargin,
      actualRevenue: shipment.actualRevenue,
      actualCost: shipment.actualCost,
      actualMargin: shipment.actualMargin,
      distance: shipment.distance,
      estimatedOD: shipment.estimatedOD,
      actualOD: shipment.actualOD,
      status: shipment.status,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };
  }
}
