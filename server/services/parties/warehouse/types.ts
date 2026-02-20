import { Warehouse } from "@/server/db/generated/prisma/client";

export interface CreateWarehouseInput {
  name: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  serviceTypes?: string[];
  capacity?: number;
  operationsManager?: string;
  averageReview?: number;
  requestedAt?: Date;
}

export interface UpdateWarehouseInput {
  name?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  serviceTypes?: string[];
  capacity?: number;
  operationsManager?: string;
  averageReview?: number;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
}

export interface WarehouseResponse extends Warehouse {
  // Add any computed fields here if needed
  fullAddress?: string;
  isVerified?: boolean;
}

export interface WarehouseFilters {
  name?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  city?: string;
  state?: string;
  postalCode?: string;
  minCapacity?: number;
  maxCapacity?: number;
  serviceType?: string;
}
