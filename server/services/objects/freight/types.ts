import { is } from "zod/v4/locales";

// Freight response types mirroring Prisma schema
export interface FreightResponse {
  id: string;
  freightNumber: string;
  freightOwnerId: string;
  brokerId: string | null;
  productName: string;
  productDescription: string | null;
  productType: string;
  hsCode: string | null;
  unitType: string;
  quantity: number;
  unitWeight: number;
  totalWeight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  volume: number;
  isHazmat: boolean;
  hazmatClass: string | null;
  hazmatUNNumber: string | null;
  hazmatDescription: string | null;
  isFragile: boolean;
  isPerishable: boolean;
  temperatureMin: number | null;
  temperatureMax: number | null;
  isValueable: boolean;
  declaredValue: bigint | null;
  requiresHandling: string[];
  currentWarehouseId: string | null;
  storageStartDate: Date | null;
  storageEndDate: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFreightInput {
  freightOwnerId: string;
  productName: string;
  productDescription?: string;
  productType: string;
  hsCode?: string;
  unitType?: string;
  quantity: number;
  unitWeight: number;
  totalWeight: number;
  length?: number;
  width?: number;
  height?: number;
  volume: number;
  isHazmat?: boolean;
  hazmatClass?: string;
  hazmatUNNumber?: string;
  hazmatDescription?: string;
  isFragile?: boolean;
  isPerishable?: boolean;
  temperatureMin?: number;
  temperatureMax?: number;
  isValueable?: boolean;
  declaredValue?: bigint;
  requiresHandling?: string[];
}

export interface UpdateFreightInput {
  productName?: string;
  productDescription?: string;
  productType?: string;
  hsCode?: string;
  quantity?: number;
  unitWeight?: number;
  totalWeight?: number;
  length?: number;
  width?: number;
  height?: number;
  volume?: number;
  isHazmat?: boolean;
  hazmatClass?: string;
  hazmatUNNumber?: string;
  hazmatDescription?: string;
  isFragile?: boolean;
  isPerishable?: boolean;
  temperatureMin?: number;
  temperatureMax?: number;
  isValueable?: boolean;
  declaredValue?: bigint;
  requiresHandling?: string[];
  status?: FreightStatus;
}

export interface FreightFilters {
  freightOwnerId?: string;
  brokerId?: string;
  productType?: string;
  hsCode?: string;
  status?: FreightStatus;
  isHazmat?: boolean;
  isFragile?: boolean;
  isPerishable?: boolean;
  isValueable?: boolean;
}

export enum FreightStatus {
  draft = "draft",
  available = "available",
  claimed = "claimed",
  assigned = "assigned",
  completed = "completed",
  archived = "archived",
}
