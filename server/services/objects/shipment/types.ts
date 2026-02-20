// Shipment response types mirroring Prisma schema
export interface ShipmentResponse {
  id: string;
  shipmentNumber: string;
  freightOwnerId: string;
  brokerId: string;
  carrierId: string | null;
  driverId: string | null;
  truckId: string | null;
  originWarehouseId: string;
  destinationWarehouseId: string | null;
  pickupScheduled: Date;
  pickupActual: Date | null;
  deliveryScheduled: Date;
  deliveryActual: Date | null;
  ownerBudget: bigint | null;
  brokerMarginPercent: number;
  brokerMarginAmount: bigint | null;
  biddingOpenedAt: Date | null;
  biddingOpenUntil: Date | null;
  acceptedBidId: string | null;
  status: string;
  baseRate: bigint | null;
  surchargeRate: bigint;
  fuelSurcharge: number;
  fuelSurchargeAmount: bigint;
  marketAdjustment: bigint;
  customerRate: bigint | null;
  carrierRate: bigint | null;
  estimatedRevenue: bigint | null;
  estimatedCost: bigint | null;
  estimatedMargin: bigint | null;
  actualRevenue: bigint | null;
  actualCost: bigint | null;
  actualMargin: bigint | null;
  distance: number | null;
  estimatedOD: number | null;
  actualOD: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShipmentInput {
  shipmentNumber: string;
  freightOwnerId: string;
  brokerId: string;
  carrierId?: string;
  driverId?: string;
  truckId?: string;
  originWarehouseId: string;
  destinationWarehouseId?: string;
  pickupScheduled: Date;
  pickupActual?: Date;
  deliveryScheduled: Date;
  deliveryActual?: Date;
  ownerBudget?: bigint;
  brokerMarginPercent: number;
  brokerMarginAmount?: bigint;
  baseRate?: bigint;
  surchargeRate: bigint;
  fuelSurcharge: number;
  fuelSurchargeAmount: bigint;
  marketAdjustment: bigint;
  customerRate?: bigint;
  carrierRate?: bigint;
  distance?: number;
  estimatedOD?: number;
  actualOD?: number;
  status: ShipmentStatus;
}

export interface UpdateShipmentInput {
  carrierId?: string;
  driverId?: string;
  truckId?: string;
  destinationWarehouseId?: string;
  pickupActual?: Date;
  deliveryActual?: Date;
  baseRate?: bigint;
  surchargeRate?: bigint;
  fuelSurcharge?: number;
  fuelSurchargeAmount?: bigint;
  marketAdjustment?: bigint;
  customerRate?: bigint;
  carrierRate?: bigint;
  estimatedRevenue?: bigint;
  estimatedCost?: bigint;
  estimatedMargin?: bigint;
  actualRevenue?: bigint;
  actualCost?: bigint;
  actualMargin?: bigint;
  distance?: number;
  estimatedOD?: number;
  actualOD?: number;
  status?: ShipmentStatus;
}

export interface ShipmentFilters {
  freightOwnerId?: string;
  brokerId?: string;
  carrierId?: string;
  status?: string;
  originWarehouseId?: string;
  destinationWarehouseId?: string;
  startDate?: Date;
  endDate?: Date;
}

export enum ShipmentStatus {
  draft = "draft",
  posted = "posted",
  bidding_open = "bidding_open",
  bids_received = "bids_received",
  bid_selected = "bid_selected",
  assigned = "assigned",
  in_transit = "in_transit",
  delivered = "delivered",
  completed = "completed",
  cancelled = "cancelled",
  disputed = "disputed",
}
