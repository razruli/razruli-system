import {
  PrismaClient,
  ShipmentFreight,
  ShipmentStop,
  ShipmentLog,
  ShipmentEvent,
  ShipmentDocument,
} from "@/server/db/generated/prisma/client";
import {
  ShipmentFreightResponse,
  CreateShipmentFreightInput,
  UpdateShipmentFreightInput,
  ShipmentFreightFilters,
  ShipmentStopResponse,
  CreateShipmentStopInput,
  UpdateShipmentStopInput,
  ShipmentStopFilters,
  ShipmentLogResponse,
  CreateShipmentLogInput,
  UpdateShipmentLogInput,
  ShipmentLogFilters,
  ShipmentEventResponse,
  CreateShipmentEventInput,
  UpdateShipmentEventInput,
  ShipmentEventFilters,
  ShipmentDocumentResponse,
  CreateShipmentDocumentInput,
  UpdateShipmentDocumentInput,
  ShipmentDocumentFilters,
} from "./types";

// ============================================================================
// SHIPMENT FREIGHT JUNCTION REPOSITORY
// ============================================================================

export class ShipmentFreightRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<ShipmentFreightResponse | null> {
    const record = await this.prisma.shipmentFreight.findUnique({
      where: { id },
    });
    return record ? this.mapToResponse(record) : null;
  }

  async findByShipmentAndFreight(
    shipmentId: string,
    freightId: string,
  ): Promise<ShipmentFreightResponse | null> {
    const record = await this.prisma.shipmentFreight.findUnique({
      where: { shipmentId_freightId: { shipmentId, freightId } },
    });
    return record ? this.mapToResponse(record) : null;
  }

  async search(
    filters: ShipmentFreightFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentFreightResponse[]> {
    const records = await this.prisma.shipmentFreight.findMany({
      where: {
        ...(filters.shipmentId && { shipmentId: filters.shipmentId }),
        ...(filters.freightId && { freightId: filters.freightId }),
      },
      skip,
      take,
      orderBy: { sequenceNumber: "asc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async listByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentFreightResponse[]> {
    const records = await this.prisma.shipmentFreight.findMany({
      where: { shipmentId },
      skip,
      take,
      orderBy: { sequenceNumber: "asc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async create(
    data: CreateShipmentFreightInput,
  ): Promise<ShipmentFreightResponse> {
    const record = await this.prisma.shipmentFreight.create({
      data: {
        shipmentId: data.shipmentId,
        freightId: data.freightId,
        sequenceNumber: data.sequenceNumber,
        pickedUpAt: data.pickedUpAt,
        deliveredAt: data.deliveredAt,
      },
    });
    return this.mapToResponse(record);
  }

  async update(
    id: string,
    data: UpdateShipmentFreightInput,
  ): Promise<ShipmentFreightResponse> {
    const updateData: any = {};
    if (data.sequenceNumber !== undefined)
      updateData.sequenceNumber = data.sequenceNumber;
    if (data.pickedUpAt !== undefined) updateData.pickedUpAt = data.pickedUpAt;
    if (data.deliveredAt !== undefined)
      updateData.deliveredAt = data.deliveredAt;

    const record = await this.prisma.shipmentFreight.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shipmentFreight.delete({ where: { id } });
  }

  private mapToResponse(record: ShipmentFreight): ShipmentFreightResponse {
    return {
      id: record.id,
      shipmentId: record.shipmentId,
      freightId: record.freightId,
      sequenceNumber: record.sequenceNumber,
      pickedUpAt: record.pickedUpAt,
      deliveredAt: record.deliveredAt,
    };
  }
}

// ============================================================================
// SHIPMENT STOP REPOSITORY
// ============================================================================

export class ShipmentStopRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<ShipmentStopResponse | null> {
    const record = await this.prisma.shipmentStop.findUnique({
      where: { id },
    });
    return record ? this.mapToResponse(record) : null;
  }

  async search(
    filters: ShipmentStopFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentStopResponse[]> {
    const records = await this.prisma.shipmentStop.findMany({
      where: {
        ...(filters.shipmentId && { shipmentId: filters.shipmentId }),
        ...(filters.stopType && { stopType: filters.stopType }),
        ...(filters.warehouseId && { warehouseId: filters.warehouseId }),
      },
      skip,
      take,
      orderBy: { sequenceNumber: "asc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async listByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentStopResponse[]> {
    const records = await this.prisma.shipmentStop.findMany({
      where: { shipmentId },
      skip,
      take,
      orderBy: { sequenceNumber: "asc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async create(data: CreateShipmentStopInput): Promise<ShipmentStopResponse> {
    const record = await this.prisma.shipmentStop.create({
      data: {
        shipmentId: data.shipmentId,
        sequenceNumber: data.sequenceNumber,
        stopType: data.stopType || "intermediate",
        warehouseId: data.warehouseId,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        arrivedAt: data.arrivedAt,
        departedAt: data.departedAt,
        duration: data.duration,
        notes: data.notes,
      },
    });
    return this.mapToResponse(record);
  }

  async update(
    id: string,
    data: UpdateShipmentStopInput,
  ): Promise<ShipmentStopResponse> {
    const updateData: any = {};
    if (data.sequenceNumber !== undefined)
      updateData.sequenceNumber = data.sequenceNumber;
    if (data.stopType !== undefined) updateData.stopType = data.stopType;
    if (data.warehouseId !== undefined)
      updateData.warehouseId = data.warehouseId;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.arrivedAt !== undefined) updateData.arrivedAt = data.arrivedAt;
    if (data.departedAt !== undefined) updateData.departedAt = data.departedAt;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const record = await this.prisma.shipmentStop.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shipmentStop.delete({ where: { id } });
  }

  private mapToResponse(record: ShipmentStop): ShipmentStopResponse {
    return {
      id: record.id,
      shipmentId: record.shipmentId,
      sequenceNumber: record.sequenceNumber,
      stopType: record.stopType,
      warehouseId: record.warehouseId,
      latitude: record.latitude,
      longitude: record.longitude,
      address: record.address,
      arrivedAt: record.arrivedAt,
      departedAt: record.departedAt,
      duration: record.duration,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}

// ============================================================================
// SHIPMENT LOG REPOSITORY
// ============================================================================

export class ShipmentLogRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<ShipmentLogResponse | null> {
    const record = await this.prisma.shipmentLog.findUnique({
      where: { id },
    });
    return record ? this.mapToResponse(record) : null;
  }

  async search(
    filters: ShipmentLogFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentLogResponse[]> {
    const records = await this.prisma.shipmentLog.findMany({
      where: {
        ...(filters.shipmentId && { shipmentId: filters.shipmentId }),
        ...(filters.eventType && { eventType: filters.eventType }),
        ...(filters.startTime && { eventTime: { gte: filters.startTime } }),
        ...(filters.endTime && { eventTime: { lte: filters.endTime } }),
      },
      skip,
      take,
      orderBy: { eventTime: "desc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async listByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentLogResponse[]> {
    const records = await this.prisma.shipmentLog.findMany({
      where: { shipmentId },
      skip,
      take,
      orderBy: { eventTime: "desc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async create(data: CreateShipmentLogInput): Promise<ShipmentLogResponse> {
    const record = await this.prisma.shipmentLog.create({
      data: {
        shipmentId: data.shipmentId,
        eventType: data.eventType,
        eventTime: data.eventTime,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        mileage: data.mileage,
        fuelLevel: data.fuelLevel,
        temperature: data.temperature,
        humidity: data.humidity,
        deviceId: data.deviceId,
        notes: data.notes,
      },
    });
    return this.mapToResponse(record);
  }

  async update(
    id: string,
    data: UpdateShipmentLogInput,
  ): Promise<ShipmentLogResponse> {
    const updateData: any = {};
    if (data.eventType !== undefined) updateData.eventType = data.eventType;
    if (data.eventTime !== undefined) updateData.eventTime = data.eventTime;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.mileage !== undefined) updateData.mileage = data.mileage;
    if (data.fuelLevel !== undefined) updateData.fuelLevel = data.fuelLevel;
    if (data.temperature !== undefined)
      updateData.temperature = data.temperature;
    if (data.humidity !== undefined) updateData.humidity = data.humidity;
    if (data.deviceId !== undefined) updateData.deviceId = data.deviceId;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const record = await this.prisma.shipmentLog.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shipmentLog.delete({ where: { id } });
  }

  private mapToResponse(record: ShipmentLog): ShipmentLogResponse {
    return {
      id: record.id,
      shipmentId: record.shipmentId,
      eventType: record.eventType,
      eventTime: record.eventTime,
      location: record.location,
      latitude: record.latitude,
      longitude: record.longitude,
      mileage: record.mileage,
      fuelLevel: record.fuelLevel,
      temperature: record.temperature,
      humidity: record.humidity,
      deviceId: record.deviceId,
      notes: record.notes,
      createdAt: record.createdAt,
    };
  }
}

// ============================================================================
// SHIPMENT EVENT REPOSITORY
// ============================================================================

export class ShipmentEventRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<ShipmentEventResponse | null> {
    const record = await this.prisma.shipmentEvent.findUnique({
      where: { id },
    });
    return record ? this.mapToResponse(record) : null;
  }

  async search(
    filters: ShipmentEventFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentEventResponse[]> {
    const records = await this.prisma.shipmentEvent.findMany({
      where: {
        ...(filters.shipmentId && { shipmentId: filters.shipmentId }),
        ...(filters.eventCode && { eventCode: filters.eventCode }),
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.requiresAction !== undefined && {
          requiresAction: filters.requiresAction,
        }),
      },
      skip,
      take,
      orderBy: { eventTime: "desc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async listByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentEventResponse[]> {
    const records = await this.prisma.shipmentEvent.findMany({
      where: { shipmentId },
      skip,
      take,
      orderBy: { eventTime: "desc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async create(data: CreateShipmentEventInput): Promise<ShipmentEventResponse> {
    const record = await this.prisma.shipmentEvent.create({
      data: {
        shipmentId: data.shipmentId,
        eventCode: data.eventCode,
        eventDescription: data.eventDescription,
        eventTime: data.eventTime,
        severity: data.severity || "info",
        requiresAction: data.requiresAction ?? false,
        actionTaken: data.actionTaken,
        actionDate: data.actionDate,
      },
    });
    return this.mapToResponse(record);
  }

  async update(
    id: string,
    data: UpdateShipmentEventInput,
  ): Promise<ShipmentEventResponse> {
    const updateData: any = {};
    if (data.eventCode !== undefined) updateData.eventCode = data.eventCode;
    if (data.eventDescription !== undefined)
      updateData.eventDescription = data.eventDescription;
    if (data.eventTime !== undefined) updateData.eventTime = data.eventTime;
    if (data.severity !== undefined) updateData.severity = data.severity;
    if (data.requiresAction !== undefined)
      updateData.requiresAction = data.requiresAction;
    if (data.actionTaken !== undefined)
      updateData.actionTaken = data.actionTaken;
    if (data.actionDate !== undefined) updateData.actionDate = data.actionDate;

    const record = await this.prisma.shipmentEvent.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shipmentEvent.delete({ where: { id } });
  }

  private mapToResponse(record: ShipmentEvent): ShipmentEventResponse {
    return {
      id: record.id,
      shipmentId: record.shipmentId,
      eventCode: record.eventCode,
      eventDescription: record.eventDescription,
      eventTime: record.eventTime,
      severity: record.severity,
      requiresAction: record.requiresAction,
      actionTaken: record.actionTaken,
      actionDate: record.actionDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}

// ============================================================================
// SHIPMENT DOCUMENT REPOSITORY
// ============================================================================

export class ShipmentDocumentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<ShipmentDocumentResponse | null> {
    const record = await this.prisma.shipmentDocument.findUnique({
      where: { id },
    });
    return record ? this.mapToResponse(record) : null;
  }

  async search(
    filters: ShipmentDocumentFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentDocumentResponse[]> {
    const records = await this.prisma.shipmentDocument.findMany({
      where: {
        ...(filters.shipmentId && { shipmentId: filters.shipmentId }),
        ...(filters.documentType && { documentType: filters.documentType }),
        ...(filters.verified !== undefined && { verified: filters.verified }),
      },
      skip,
      take,
      orderBy: { uploadedAt: "desc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async listByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentDocumentResponse[]> {
    const records = await this.prisma.shipmentDocument.findMany({
      where: { shipmentId },
      skip,
      take,
      orderBy: { uploadedAt: "desc" },
    });
    return records.map((r) => this.mapToResponse(r));
  }

  async create(
    data: CreateShipmentDocumentInput,
  ): Promise<ShipmentDocumentResponse> {
    const record = await this.prisma.shipmentDocument.create({
      data: {
        shipmentId: data.shipmentId,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        uploadedAt: data.uploadedAt,
        expiresAt: data.expiresAt,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        verified: data.verified ?? false,
        verifiedAt: data.verifiedAt,
        verifiedBy: data.verifiedBy,
      },
    });
    return this.mapToResponse(record);
  }

  async update(
    id: string,
    data: UpdateShipmentDocumentInput,
  ): Promise<ShipmentDocumentResponse> {
    const updateData: any = {};
    if (data.documentType !== undefined)
      updateData.documentType = data.documentType;
    if (data.documentNumber !== undefined)
      updateData.documentNumber = data.documentNumber;
    if (data.fileName !== undefined) updateData.fileName = data.fileName;
    if (data.fileUrl !== undefined) updateData.fileUrl = data.fileUrl;
    if (data.fileSize !== undefined) updateData.fileSize = data.fileSize;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;
    if (data.issueDate !== undefined) updateData.issueDate = data.issueDate;
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate;
    if (data.verified !== undefined) updateData.verified = data.verified;
    if (data.verifiedAt !== undefined) updateData.verifiedAt = data.verifiedAt;
    if (data.verifiedBy !== undefined) updateData.verifiedBy = data.verifiedBy;

    const record = await this.prisma.shipmentDocument.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shipmentDocument.delete({ where: { id } });
  }

  private mapToResponse(record: ShipmentDocument): ShipmentDocumentResponse {
    return {
      id: record.id,
      shipmentId: record.shipmentId,
      documentType: record.documentType,
      documentNumber: record.documentNumber,
      fileName: record.fileName,
      fileUrl: record.fileUrl,
      fileSize: record.fileSize,
      uploadedAt: record.uploadedAt,
      expiresAt: record.expiresAt,
      issueDate: record.issueDate,
      expiryDate: record.expiryDate,
      verified: record.verified,
      verifiedAt: record.verifiedAt,
      verifiedBy: record.verifiedBy,
    };
  }
}
