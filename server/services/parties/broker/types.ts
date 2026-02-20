import { Broker } from "@/server/db/generated/prisma/client";

export interface CreateBrokerInput {
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
  licenseNumber?: string;
  operationsManager?: string;
  averageReview?: number;
  requestedAt?: Date;
}

export interface UpdateBrokerInput {
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
  licenseNumber?: string;
  operationsManager?: string;
  averageReview?: number;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
}

export interface BrokerResponse extends Broker {
  // Add any computed fields here if needed
  fullAddress?: string;
  isVerified?: boolean;
}

export interface BrokerFilters {
  name?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  city?: string;
  licenseNumber?: string;
}
