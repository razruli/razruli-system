import {
  PrismaClient,
  BrokerCarrierContract,
  BrokerRate,
  CarrierRate,
  CarrierAccessorial,
} from "@/server/db/generated/prisma/client";
import {
  BrokerCarrierContractResponse,
  CreateBrokerCarrierContractInput,
  UpdateBrokerCarrierContractInput,
  BrokerCarrierContractFilters,
  BrokerRateResponse,
  CreateBrokerRateInput,
  UpdateBrokerRateInput,
  BrokerRateFilters,
  CarrierRateResponse,
  CreateCarrierRateInput,
  UpdateCarrierRateInput,
  CarrierRateFilters,
  CarrierAccessorialResponse,
  CreateCarrierAccessorialInput,
  UpdateCarrierAccessorialInput,
  CarrierAccessorialFilters,
} from "./types";

// ============================================================================
// BROKER-CARRIER CONTRACT REPOSITORY
// ============================================================================

export class BrokerCarrierContractRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<BrokerCarrierContractResponse | null> {
    const contract = await this.prisma.brokerCarrierContract.findUnique({
      where: { id },
    });
    return contract ? this.mapToResponse(contract) : null;
  }

  async findByContractNumber(
    contractNumber: string,
  ): Promise<BrokerCarrierContractResponse | null> {
    const contract = await this.prisma.brokerCarrierContract.findUnique({
      where: { contractNumber },
    });
    return contract ? this.mapToResponse(contract) : null;
  }

  async findByBrokerAndCarrier(
    brokerId: string,
    carrierId: string,
  ): Promise<BrokerCarrierContractResponse | null> {
    const contract = await this.prisma.brokerCarrierContract.findUnique({
      where: { brokerId_carrierId: { brokerId, carrierId } },
    });
    return contract ? this.mapToResponse(contract) : null;
  }

  async search(
    filters: BrokerCarrierContractFilters,
    skip = 0,
    take = 10,
  ): Promise<BrokerCarrierContractResponse[]> {
    const contracts = await this.prisma.brokerCarrierContract.findMany({
      where: {
        ...(filters.brokerId && { brokerId: filters.brokerId }),
        ...(filters.carrierId && { carrierId: filters.carrierId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: { gte: filters.startDate } }),
        ...(filters.endDate && { endDate: { lte: filters.endDate } }),
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return contracts.map((c) => this.mapToResponse(c));
  }

  async list(skip = 0, take = 10): Promise<BrokerCarrierContractResponse[]> {
    const contracts = await this.prisma.brokerCarrierContract.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return contracts.map((c) => this.mapToResponse(c));
  }

  async create(
    data: CreateBrokerCarrierContractInput,
  ): Promise<BrokerCarrierContractResponse> {
    const contract = await this.prisma.brokerCarrierContract.create({
      data: {
        brokerId: data.brokerId,
        carrierId: data.carrierId,
        contractNumber: data.contractNumber,
        status: data.status || "active",
        startDate: data.startDate,
        endDate: data.endDate,
        defaultRate: data.defaultRate,
        minRate: data.minRate,
        maxRate: data.maxRate,
        volumeDiscount: data.volumeDiscount || 0.0,
        volumeThreshold: data.volumeThreshold,
        termsDays: data.termsDays || 30,
        paymentTerms: data.paymentTerms || "Net30",
        baselineFuel: data.baselineFuel || 3.0,
        fuelSurchargeFormula:
          data.fuelSurchargeFormula || "(current_price - baseline) * 0.90",
        notes: data.notes,
      },
    });
    return this.mapToResponse(contract);
  }

  async update(
    id: string,
    data: UpdateBrokerCarrierContractInput,
  ): Promise<BrokerCarrierContractResponse> {
    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.defaultRate !== undefined)
      updateData.defaultRate = data.defaultRate;
    if (data.minRate !== undefined) updateData.minRate = data.minRate;
    if (data.maxRate !== undefined) updateData.maxRate = data.maxRate;
    if (data.volumeDiscount !== undefined)
      updateData.volumeDiscount = data.volumeDiscount;
    if (data.volumeThreshold !== undefined)
      updateData.volumeThreshold = data.volumeThreshold;
    if (data.termsDays !== undefined) updateData.termsDays = data.termsDays;
    if (data.paymentTerms !== undefined)
      updateData.paymentTerms = data.paymentTerms;
    if (data.baselineFuel !== undefined)
      updateData.baselineFuel = data.baselineFuel;
    if (data.fuelSurchargeFormula !== undefined)
      updateData.fuelSurchargeFormula = data.fuelSurchargeFormula;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const contract = await this.prisma.brokerCarrierContract.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(contract);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.brokerCarrierContract.delete({
      where: { id },
    });
  }

  private mapToResponse(
    contract: BrokerCarrierContract,
  ): BrokerCarrierContractResponse {
    return {
      id: contract.id,
      brokerId: contract.brokerId,
      carrierId: contract.carrierId,
      contractNumber: contract.contractNumber,
      status: contract.status,
      startDate: contract.startDate,
      endDate: contract.endDate,
      defaultRate: contract.defaultRate,
      minRate: contract.minRate,
      maxRate: contract.maxRate,
      volumeDiscount: contract.volumeDiscount,
      volumeThreshold: contract.volumeThreshold,
      termsDays: contract.termsDays,
      paymentTerms: contract.paymentTerms,
      baselineFuel: contract.baselineFuel,
      fuelSurchargeFormula: contract.fuelSurchargeFormula,
      notes: contract.notes,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    };
  }
}

// ============================================================================
// BROKER RATE REPOSITORY
// ============================================================================

export class BrokerRateRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<BrokerRateResponse | null> {
    const rate = await this.prisma.brokerRate.findUnique({
      where: { id },
    });
    return rate ? this.mapToResponse(rate) : null;
  }

  async search(
    filters: BrokerRateFilters,
    skip = 0,
    take = 10,
  ): Promise<BrokerRateResponse[]> {
    const rates = await this.prisma.brokerRate.findMany({
      where: {
        ...(filters.contractId && { contractId: filters.contractId }),
        ...(filters.originState && { originState: filters.originState }),
        ...(filters.destState && { destState: filters.destState }),
        ...(filters.originCity && { originCity: filters.originCity }),
        ...(filters.destCity && { destCity: filters.destCity }),
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return rates.map((r) => this.mapToResponse(r));
  }

  async listByContract(
    contractId: string,
    skip = 0,
    take = 10,
  ): Promise<BrokerRateResponse[]> {
    const rates = await this.prisma.brokerRate.findMany({
      where: { contractId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return rates.map((r) => this.mapToResponse(r));
  }

  async list(skip = 0, take = 10): Promise<BrokerRateResponse[]> {
    const rates = await this.prisma.brokerRate.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return rates.map((r) => this.mapToResponse(r));
  }

  async create(data: CreateBrokerRateInput): Promise<BrokerRateResponse> {
    const rate = await this.prisma.brokerRate.create({
      data: {
        contractId: data.contractId,
        brokerRateId: data.brokerRateId,
        originState: data.originState,
        destState: data.destState,
        originCity: data.originCity,
        destCity: data.destCity,
        laneDescription: data.laneDescription,
        rate: data.rate,
        minimumCharge: data.minimumCharge,
        effectiveDate: data.effectiveDate,
        expiryDate: data.expiryDate,
        freightClassMin: data.freightClassMin,
        freightClassMax: data.freightClassMax,
        weightMin: data.weightMin,
        weightMax: data.weightMax,
      },
    });
    return this.mapToResponse(rate);
  }

  async update(
    id: string,
    data: UpdateBrokerRateInput,
  ): Promise<BrokerRateResponse> {
    const updateData: any = {};
    if (data.rate !== undefined) updateData.rate = data.rate;
    if (data.minimumCharge !== undefined)
      updateData.minimumCharge = data.minimumCharge;
    if (data.effectiveDate !== undefined)
      updateData.effectiveDate = data.effectiveDate;
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate;
    if (data.freightClassMin !== undefined)
      updateData.freightClassMin = data.freightClassMin;
    if (data.freightClassMax !== undefined)
      updateData.freightClassMax = data.freightClassMax;
    if (data.weightMin !== undefined) updateData.weightMin = data.weightMin;
    if (data.weightMax !== undefined) updateData.weightMax = data.weightMax;

    const rate = await this.prisma.brokerRate.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(rate);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.brokerRate.delete({
      where: { id },
    });
  }

  private mapToResponse(rate: BrokerRate): BrokerRateResponse {
    return {
      id: rate.id,
      contractId: rate.contractId,
      brokerRateId: rate.brokerRateId,
      originState: rate.originState,
      destState: rate.destState,
      originCity: rate.originCity,
      destCity: rate.destCity,
      laneDescription: rate.laneDescription,
      rate: rate.rate,
      minimumCharge: rate.minimumCharge,
      effectiveDate: rate.effectiveDate,
      expiryDate: rate.expiryDate,
      freightClassMin: rate.freightClassMin,
      freightClassMax: rate.freightClassMax,
      weightMin: rate.weightMin,
      weightMax: rate.weightMax,
      createdAt: rate.createdAt,
      updatedAt: rate.updatedAt,
    };
  }
}

// ============================================================================
// CARRIER RATE REPOSITORY
// ============================================================================

export class CarrierRateRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<CarrierRateResponse | null> {
    const rate = await this.prisma.carrierRate.findUnique({
      where: { id },
    });
    return rate ? this.mapToResponse(rate) : null;
  }

  async findByCarrierRateId(
    carrierRateId: string,
  ): Promise<CarrierRateResponse | null> {
    const rate = await this.prisma.carrierRate.findUnique({
      where: { carrierRateId },
    });
    return rate ? this.mapToResponse(rate) : null;
  }

  async search(
    filters: CarrierRateFilters,
    skip = 0,
    take = 10,
  ): Promise<CarrierRateResponse[]> {
    const rates = await this.prisma.carrierRate.findMany({
      where: {
        ...(filters.carrierId && { carrierId: filters.carrierId }),
        ...(filters.originState && { originState: filters.originState }),
        ...(filters.destState && { destState: filters.destState }),
        ...(filters.originCity && { originCity: filters.originCity }),
        ...(filters.destCity && { destCity: filters.destCity }),
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return rates.map((r) => this.mapToResponse(r));
  }

  async listByCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<CarrierRateResponse[]> {
    const rates = await this.prisma.carrierRate.findMany({
      where: { carrierId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return rates.map((r) => this.mapToResponse(r));
  }

  async list(skip = 0, take = 10): Promise<CarrierRateResponse[]> {
    const rates = await this.prisma.carrierRate.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return rates.map((r) => this.mapToResponse(r));
  }

  async create(data: CreateCarrierRateInput): Promise<CarrierRateResponse> {
    const rate = await this.prisma.carrierRate.create({
      data: {
        carrierId: data.carrierId,
        carrierRateId: data.carrierRateId,
        originState: data.originState,
        destState: data.destState,
        originCity: data.originCity,
        destCity: data.destCity,
        laneDescription: data.laneDescription,
        baseRate: data.baseRate,
        minRate: data.minRate,
        maxRate: data.maxRate,
        costPerMile: data.costPerMile,
        deadheadCost: data.deadheadCost,
        effectiveDate: data.effectiveDate,
        expiryDate: data.expiryDate,
        freightClassMin: data.freightClassMin,
        freightClassMax: data.freightClassMax,
        weightMin: data.weightMin,
        weightMax: data.weightMax,
      },
    });
    return this.mapToResponse(rate);
  }

  async update(
    id: string,
    data: UpdateCarrierRateInput,
  ): Promise<CarrierRateResponse> {
    const updateData: any = {};
    if (data.baseRate !== undefined) updateData.baseRate = data.baseRate;
    if (data.minRate !== undefined) updateData.minRate = data.minRate;
    if (data.maxRate !== undefined) updateData.maxRate = data.maxRate;
    if (data.costPerMile !== undefined)
      updateData.costPerMile = data.costPerMile;
    if (data.deadheadCost !== undefined)
      updateData.deadheadCost = data.deadheadCost;
    if (data.effectiveDate !== undefined)
      updateData.effectiveDate = data.effectiveDate;
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate;
    if (data.freightClassMin !== undefined)
      updateData.freightClassMin = data.freightClassMin;
    if (data.freightClassMax !== undefined)
      updateData.freightClassMax = data.freightClassMax;
    if (data.weightMin !== undefined) updateData.weightMin = data.weightMin;
    if (data.weightMax !== undefined) updateData.weightMax = data.weightMax;

    const rate = await this.prisma.carrierRate.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(rate);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.carrierRate.delete({
      where: { id },
    });
  }

  private mapToResponse(rate: CarrierRate): CarrierRateResponse {
    return {
      id: rate.id,
      carrierId: rate.carrierId,
      carrierRateId: rate.carrierRateId,
      originState: rate.originState,
      destState: rate.destState,
      originCity: rate.originCity,
      destCity: rate.destCity,
      laneDescription: rate.laneDescription,
      baseRate: rate.baseRate,
      minRate: rate.minRate,
      maxRate: rate.maxRate,
      costPerMile: rate.costPerMile,
      deadheadCost: rate.deadheadCost,
      effectiveDate: rate.effectiveDate,
      expiryDate: rate.expiryDate,
      freightClassMin: rate.freightClassMin,
      freightClassMax: rate.freightClassMax,
      weightMin: rate.weightMin,
      weightMax: rate.weightMax,
      createdAt: rate.createdAt,
      updatedAt: rate.updatedAt,
    };
  }
}

// ============================================================================
// CARRIER ACCESSORIAL REPOSITORY
// ============================================================================

export class CarrierAccessorialRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<CarrierAccessorialResponse | null> {
    const accessorial = await this.prisma.carrierAccessorial.findUnique({
      where: { id },
    });
    return accessorial ? this.mapToResponse(accessorial) : null;
  }

  async findByCarrierAndServiceCode(
    carrierId: string,
    serviceCode: string,
  ): Promise<CarrierAccessorialResponse | null> {
    const accessorial = await this.prisma.carrierAccessorial.findUnique({
      where: { carrierId_serviceCode: { carrierId, serviceCode } },
    });
    return accessorial ? this.mapToResponse(accessorial) : null;
  }

  async search(
    filters: CarrierAccessorialFilters,
    skip = 0,
    take = 10,
  ): Promise<CarrierAccessorialResponse[]> {
    const accessorials = await this.prisma.carrierAccessorial.findMany({
      where: {
        ...(filters.carrierId && { carrierId: filters.carrierId }),
        ...(filters.serviceCode && { serviceCode: filters.serviceCode }),
        ...(filters.serviceName && {
          serviceName: { contains: filters.serviceName },
        }),
        ...(filters.isApproved !== undefined && {
          isApproved: filters.isApproved,
        }),
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return accessorials.map((a) => this.mapToResponse(a));
  }

  async listByCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<CarrierAccessorialResponse[]> {
    const accessorials = await this.prisma.carrierAccessorial.findMany({
      where: { carrierId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return accessorials.map((a) => this.mapToResponse(a));
  }

  async list(skip = 0, take = 10): Promise<CarrierAccessorialResponse[]> {
    const accessorials = await this.prisma.carrierAccessorial.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
    return accessorials.map((a) => this.mapToResponse(a));
  }

  async create(
    data: CreateCarrierAccessorialInput,
  ): Promise<CarrierAccessorialResponse> {
    const accessorial = await this.prisma.carrierAccessorial.create({
      data: {
        carrierId: data.carrierId,
        serviceCode: data.serviceCode,
        serviceName: data.serviceName,
        serviceDescription: data.serviceDescription,
        unitType: data.unitType || "flat",
        unitRate: data.unitRate,
        availableRegions: data.availableRegions || [],
        minRate: data.minRate || 0n,
        maxRate: data.maxRate || 0n,
        isApproved: data.isApproved ?? true,
      },
    });
    return this.mapToResponse(accessorial);
  }

  async update(
    id: string,
    data: UpdateCarrierAccessorialInput,
  ): Promise<CarrierAccessorialResponse> {
    const updateData: any = {};
    if (data.serviceName !== undefined)
      updateData.serviceName = data.serviceName;
    if (data.serviceDescription !== undefined)
      updateData.serviceDescription = data.serviceDescription;
    if (data.unitType !== undefined) updateData.unitType = data.unitType;
    if (data.unitRate !== undefined) updateData.unitRate = data.unitRate;
    if (data.availableRegions !== undefined)
      updateData.availableRegions = data.availableRegions;
    if (data.minRate !== undefined) updateData.minRate = data.minRate;
    if (data.maxRate !== undefined) updateData.maxRate = data.maxRate;
    if (data.isApproved !== undefined) updateData.isApproved = data.isApproved;

    const accessorial = await this.prisma.carrierAccessorial.update({
      where: { id },
      data: updateData,
    });
    return this.mapToResponse(accessorial);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.carrierAccessorial.delete({
      where: { id },
    });
  }

  private mapToResponse(
    accessorial: CarrierAccessorial,
  ): CarrierAccessorialResponse {
    return {
      id: accessorial.id,
      carrierId: accessorial.carrierId,
      serviceCode: accessorial.serviceCode,
      serviceName: accessorial.serviceName,
      serviceDescription: accessorial.serviceDescription,
      unitType: accessorial.unitType,
      unitRate: accessorial.unitRate,
      availableRegions: accessorial.availableRegions,
      minRate: accessorial.minRate,
      maxRate: accessorial.maxRate,
      isApproved: accessorial.isApproved,
      createdAt: accessorial.createdAt,
      updatedAt: accessorial.updatedAt,
    };
  }
}
