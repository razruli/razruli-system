// ============================================================================
// BROKER-CARRIER CONTRACTS
// ============================================================================

export interface BrokerCarrierContractResponse {
  id: string;
  brokerId: string;
  carrierId: string;
  contractNumber: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  defaultRate: bigint;
  minRate: bigint;
  maxRate: bigint;
  volumeDiscount: number;
  volumeThreshold: number | null;
  termsDays: number;
  paymentTerms: string;
  baselineFuel: number;
  fuelSurchargeFormula: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrokerCarrierContractInput {
  brokerId: string;
  carrierId: string;
  contractNumber: string;
  status?: string;
  startDate: Date;
  endDate?: Date;
  defaultRate: bigint;
  minRate: bigint;
  maxRate: bigint;
  volumeDiscount?: number;
  volumeThreshold?: number;
  termsDays?: number;
  paymentTerms?: string;
  baselineFuel?: number;
  fuelSurchargeFormula?: string;
  notes?: string;
}

export interface UpdateBrokerCarrierContractInput {
  status?: string;
  endDate?: Date;
  defaultRate?: bigint;
  minRate?: bigint;
  maxRate?: bigint;
  volumeDiscount?: number;
  volumeThreshold?: number;
  termsDays?: number;
  paymentTerms?: string;
  baselineFuel?: number;
  fuelSurchargeFormula?: string;
  notes?: string;
}

export interface BrokerCarrierContractFilters {
  brokerId?: string;
  carrierId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

// ============================================================================
// BROKER RATES
// ============================================================================

export interface BrokerRateResponse {
  id: string;
  contractId: string;
  brokerRateId: string;
  originState: string | null;
  destState: string | null;
  originCity: string | null;
  destCity: string | null;
  laneDescription: string | null;
  rate: bigint;
  minimumCharge: bigint;
  effectiveDate: Date;
  expiryDate: Date | null;
  freightClassMin: number | null;
  freightClassMax: number | null;
  weightMin: number | null;
  weightMax: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrokerRateInput {
  contractId: string;
  brokerRateId: string;
  originState?: string;
  destState?: string;
  originCity?: string;
  destCity?: string;
  laneDescription?: string;
  rate: bigint;
  minimumCharge: bigint;
  effectiveDate: Date;
  expiryDate?: Date;
  freightClassMin?: number;
  freightClassMax?: number;
  weightMin?: number;
  weightMax?: number;
}

export interface UpdateBrokerRateInput {
  rate?: bigint;
  minimumCharge?: bigint;
  effectiveDate?: Date;
  expiryDate?: Date;
  freightClassMin?: number;
  freightClassMax?: number;
  weightMin?: number;
  weightMax?: number;
}

export interface BrokerRateFilters {
  contractId?: string;
  originState?: string;
  destState?: string;
  originCity?: string;
  destCity?: string;
}

// ============================================================================
// CARRIER RATES
// ============================================================================

export interface CarrierRateResponse {
  id: string;
  carrierId: string;
  carrierRateId: string;
  originState: string | null;
  destState: string | null;
  originCity: string | null;
  destCity: string | null;
  laneDescription: string | null;
  baseRate: bigint;
  minRate: bigint;
  maxRate: bigint;
  costPerMile: number | null;
  deadheadCost: bigint | null;
  effectiveDate: Date;
  expiryDate: Date | null;
  freightClassMin: number | null;
  freightClassMax: number | null;
  weightMin: number | null;
  weightMax: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCarrierRateInput {
  carrierId: string;
  carrierRateId: string;
  originState?: string;
  destState?: string;
  originCity?: string;
  destCity?: string;
  laneDescription?: string;
  baseRate: bigint;
  minRate: bigint;
  maxRate: bigint;
  costPerMile?: number;
  deadheadCost?: bigint;
  effectiveDate: Date;
  expiryDate?: Date;
  freightClassMin?: number;
  freightClassMax?: number;
  weightMin?: number;
  weightMax?: number;
}

export interface UpdateCarrierRateInput {
  baseRate?: bigint;
  minRate?: bigint;
  maxRate?: bigint;
  costPerMile?: number;
  deadheadCost?: bigint;
  effectiveDate?: Date;
  expiryDate?: Date;
  freightClassMin?: number;
  freightClassMax?: number;
  weightMin?: number;
  weightMax?: number;
}

export interface CarrierRateFilters {
  carrierId?: string;
  originState?: string;
  destState?: string;
  originCity?: string;
  destCity?: string;
}

// ============================================================================
// CARRIER ACCESSORIALS
// ============================================================================

export interface CarrierAccessorialResponse {
  id: string;
  carrierId: string;
  serviceCode: string;
  serviceName: string;
  serviceDescription: string | null;
  unitType: string;
  unitRate: bigint;
  availableRegions: string[];
  minRate: bigint;
  maxRate: bigint;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCarrierAccessorialInput {
  carrierId: string;
  serviceCode: string;
  serviceName: string;
  serviceDescription?: string;
  unitType?: string;
  unitRate: bigint;
  availableRegions?: string[];
  minRate?: bigint;
  maxRate?: bigint;
  isApproved?: boolean;
}

export interface UpdateCarrierAccessorialInput {
  serviceName?: string;
  serviceDescription?: string;
  unitType?: string;
  unitRate?: bigint;
  availableRegions?: string[];
  minRate?: bigint;
  maxRate?: bigint;
  isApproved?: boolean;
}

export interface CarrierAccessorialFilters {
  carrierId?: string;
  serviceCode?: string;
  serviceName?: string;
  isApproved?: boolean;
}
