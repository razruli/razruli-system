import { Carrier } from "@/server/db/generated/prisma/client";

export interface CreateCarrierInput {
  name: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  companyRegistration?: string;
  dotNumber?: string;
  mcNumber?: string;
  fleetSize?: number;
  operationsManager?: string;
  averageReview?: number;
  requestedAt?: Date;
}

export interface UpdateCarrierInput {
  name?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  companyRegistration?: string;
  dotNumber?: string;
  mcNumber?: string;
  fleetSize?: number;
  operationsManager?: string;
  averageReview?: number;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
}

export interface CarrierResponse extends Carrier {}

export interface CarrierFilters {
  name?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  city?: string;
  dotNumber?: string;
  minFleetSize?: number;
  maxFleetSize?: number;
}
