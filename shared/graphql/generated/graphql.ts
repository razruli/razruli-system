/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: bigint; output: bigint; }
  DateTime: { input: Date; output: Date; }
  JSON: { input: Record<string, any>; output: Record<string, any>; }
  Upload: { input: any; output: any; }
};

export type AuditFilterInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  eventType?: InputMaybe<EventType>;
  freightId?: InputMaybe<Scalars['ID']['input']>;
  shipmentId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AuditLogConnection = {
  __typename?: 'AuditLogConnection';
  items: Array<ShipmentLog>;
  pageInfo: PageInfo;
};

export type AuditTrailConnection = {
  __typename?: 'AuditTrailConnection';
  items: Array<ShipmentEvent>;
  pageInfo: PageInfo;
};

export type BidAcceptedEvent = {
  __typename?: 'BidAcceptedEvent';
  bidId: Scalars['ID']['output'];
  carrierId: Scalars['String']['output'];
  shipmentId: Scalars['ID']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type BidConnection = {
  __typename?: 'BidConnection';
  items: Array<ShipmentBid>;
  pageInfo: PageInfo;
};

export type BidInput = {
  estimatedDeliveryDate?: InputMaybe<Scalars['DateTime']['input']>;
  insuranceAmount?: InputMaybe<Scalars['BigInt']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  rate: Scalars['BigInt']['input'];
};

export type BidReceivedEvent = {
  __typename?: 'BidReceivedEvent';
  bid: ShipmentBid;
  shipmentId: Scalars['ID']['output'];
  timestamp: Scalars['DateTime']['output'];
};

/** Result of bid rule validation */
export type BidRequirement = Node & {
  __typename?: 'BidRequirement';
  bidId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  passed: Scalars['Boolean']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  ruleId: Scalars['ID']['output'];
};

/**
 * Rule #4: Bid rule for shipment
 * AUTO-VALIDATED before bid visibility
 */
export type BidRule = Node & {
  __typename?: 'BidRule';
  createdAt: Scalars['DateTime']['output'];
  enforced: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  requirementValue: Scalars['String']['output'];
  ruleType: RuleType;
  shipmentId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BidRuleInput = {
  enforced?: InputMaybe<Scalars['Boolean']['input']>;
  requirementValue: Scalars['String']['input'];
  ruleType: RuleType;
};

export enum BidStatus {
  Accepted = 'ACCEPTED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  RuleCompliant = 'RULE_COMPLIANT',
  RuleNonCompliant = 'RULE_NON_COMPLIANT'
}

/**
 * Freight broker - coordinates shipment movement
 * Phase 2-11: Creates shipments, opens bidding, selects carriers
 */
export type Broker = Node & {
  __typename?: 'Broker';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  companyName: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  phone: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
  reviewCount: Scalars['Int']['output'];
  shipments: Array<Shipment>;
  state: Scalars['String']['output'];
  totalShipments: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verificationStatus: VerificationStatus;
  zipCode: Scalars['String']['output'];
};

export type BrokerCarrierContract = Node & {
  __typename?: 'BrokerCarrierContract';
  baselineFuel: Scalars['Float']['output'];
  broker: Broker;
  carrier: Carrier;
  contractNumber: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  defaultRate: Scalars['BigInt']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  fuelSurchargeFormula: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maxRate: Scalars['BigInt']['output'];
  minRate: Scalars['BigInt']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  paymentTerms: Scalars['String']['output'];
  rates: Array<BrokerRate>;
  startDate: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  termsDays: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  volumeDiscount: Scalars['Float']['output'];
  volumeThreshold?: Maybe<Scalars['Int']['output']>;
};

export type BrokerCarrierContractConnection = {
  __typename?: 'BrokerCarrierContractConnection';
  items: Array<BrokerCarrierContract>;
  pageInfo: PageInfo;
};

export type BrokerConnection = {
  __typename?: 'BrokerConnection';
  items: Array<Broker>;
  pageInfo: PageInfo;
};

export type BrokerRate = Node & {
  __typename?: 'BrokerRate';
  brokerRateId: Scalars['String']['output'];
  contract: BrokerCarrierContract;
  createdAt: Scalars['DateTime']['output'];
  destCity?: Maybe<Scalars['String']['output']>;
  destState?: Maybe<Scalars['String']['output']>;
  effectiveDate: Scalars['DateTime']['output'];
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  freightClassMax?: Maybe<Scalars['Int']['output']>;
  freightClassMin?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  laneDescription?: Maybe<Scalars['String']['output']>;
  minimumCharge: Scalars['BigInt']['output'];
  originCity?: Maybe<Scalars['String']['output']>;
  originState?: Maybe<Scalars['String']['output']>;
  rate: Scalars['BigInt']['output'];
  updatedAt: Scalars['DateTime']['output'];
  weightMax?: Maybe<Scalars['Float']['output']>;
  weightMin?: Maybe<Scalars['Float']['output']>;
};

export type BrokerRateConnection = {
  __typename?: 'BrokerRateConnection';
  items: Array<BrokerRate>;
  pageInfo: PageInfo;
};

/**
 * Rule #7: Cancellation Penalties (Protect Bidders)
 * 5% fee if cancelled after BIDDING_OPEN
 * 10% fee if cancelled after BID_SELECTED (10% to selected, 5% to others)
 */
export type CancellationFee = Node & {
  __typename?: 'CancellationFee';
  calculatedAt: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  distributedAt?: Maybe<Scalars['DateTime']['output']>;
  feePercentage: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  paidBidderIds: Array<Scalars['String']['output']>;
  shipmentId: Scalars['ID']['output'];
  totalFeeAmount: Scalars['BigInt']['output'];
};

export type CancellationFeeConnection = {
  __typename?: 'CancellationFeeConnection';
  items: Array<CancellationFee>;
  pageInfo: PageInfo;
};

/**
 * Transportation company that owns fleet and manages drivers
 * Phase 4-6: Submits bids on shipments + confirms paperwork
 * Rule #10: Visible Assignment - rating visible to all
 */
export type Carrier = Node & {
  __typename?: 'Carrier';
  address: Scalars['String']['output'];
  averageFleetAge?: Maybe<Scalars['Int']['output']>;
  cargoInsurance: Scalars['Boolean']['output'];
  city: Scalars['String']['output'];
  companyName: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  damageRate: Scalars['Float']['output'];
  dotNumber: Scalars['String']['output'];
  drivers: Array<Driver>;
  email: Scalars['String']['output'];
  fleetTypes: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  insuranceExpiryDate: Scalars['DateTime']['output'];
  insurancePolicyId: Scalars['String']['output'];
  insuranceProvider: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  liabilityLimit: Scalars['BigInt']['output'];
  licenseExpiryDate: Scalars['DateTime']['output'];
  licenseNumber: Scalars['String']['output'];
  mcNumber: Scalars['String']['output'];
  onTimeDelivery: Scalars['Float']['output'];
  operatingAuthority: CarrierAuthorityType;
  phone: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
  reviewCount: Scalars['Int']['output'];
  safetyScore: Scalars['Float']['output'];
  shipments: Array<Shipment>;
  specializations: Array<Scalars['String']['output']>;
  state: Scalars['String']['output'];
  totalDrivers: Scalars['Int']['output'];
  totalShipments: Scalars['Int']['output'];
  totalTrucks: Scalars['Int']['output'];
  trucks: Array<Vehicle>;
  updatedAt: Scalars['DateTime']['output'];
  verificationStatus: VerificationStatus;
  zipCode: Scalars['String']['output'];
};

export type CarrierAccessorial = Node & {
  __typename?: 'CarrierAccessorial';
  availableRegions: Array<Scalars['String']['output']>;
  carrier: Carrier;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isApproved: Scalars['Boolean']['output'];
  maxRate: Scalars['BigInt']['output'];
  minRate: Scalars['BigInt']['output'];
  serviceCode: Scalars['String']['output'];
  serviceDescription?: Maybe<Scalars['String']['output']>;
  serviceName: Scalars['String']['output'];
  unitRate: Scalars['BigInt']['output'];
  unitType: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CarrierAccessorialConnection = {
  __typename?: 'CarrierAccessorialConnection';
  items: Array<CarrierAccessorial>;
  pageInfo: PageInfo;
};

export enum CarrierAuthorityType {
  CommonCarrier = 'COMMON_CARRIER',
  ContractCarrier = 'CONTRACT_CARRIER',
  PrivateCarrier = 'PRIVATE_CARRIER'
}

export type CarrierConnection = {
  __typename?: 'CarrierConnection';
  items: Array<Carrier>;
  pageInfo: PageInfo;
};

export type CarrierRate = Node & {
  __typename?: 'CarrierRate';
  baseRate: Scalars['BigInt']['output'];
  carrier: Carrier;
  carrierRateId: Scalars['String']['output'];
  costPerMile?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deadheadCost?: Maybe<Scalars['BigInt']['output']>;
  destCity?: Maybe<Scalars['String']['output']>;
  destState?: Maybe<Scalars['String']['output']>;
  effectiveDate: Scalars['DateTime']['output'];
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  freightClassMax?: Maybe<Scalars['Int']['output']>;
  freightClassMin?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  laneDescription?: Maybe<Scalars['String']['output']>;
  maxRate: Scalars['BigInt']['output'];
  minRate: Scalars['BigInt']['output'];
  originCity?: Maybe<Scalars['String']['output']>;
  originState?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  weightMax?: Maybe<Scalars['Float']['output']>;
  weightMin?: Maybe<Scalars['Float']['output']>;
};

export type CarrierRateConnection = {
  __typename?: 'CarrierRateConnection';
  items: Array<CarrierRate>;
  pageInfo: PageInfo;
};

export type CarrierRating = {
  __typename?: 'CarrierRating';
  averageRating: Scalars['Float']['output'];
  carrierId: Scalars['ID']['output'];
  reviewCount: Scalars['Int']['output'];
};

export type ComplianceFilterInput = {
  carrierId: Scalars['String']['input'];
  severity?: InputMaybe<Scalars['String']['input']>;
};

export type ComplianceIssue = Node & {
  __typename?: 'ComplianceIssue';
  carrierId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  issueType: Scalars['String']['output'];
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  severity: Scalars['String']['output'];
};

export type ComplianceIssueConnection = {
  __typename?: 'ComplianceIssueConnection';
  items: Array<ComplianceIssue>;
  pageInfo: PageInfo;
};

export type ComplianceStatus = Node & {
  __typename?: 'ComplianceStatus';
  carrier: Carrier;
  carrierId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  hazmatCertified: Scalars['Boolean']['output'];
  hosCompliant: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  insuranceCurrent: Scalars['Boolean']['output'];
  temperatureControlEquipped: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  vehicleAgeMet: Scalars['Boolean']['output'];
};

export type CreateBrokerCarrierContractInput = {
  brokerId: Scalars['ID']['input'];
  carrierId: Scalars['ID']['input'];
  contractNumber: Scalars['String']['input'];
  defaultRate: Scalars['BigInt']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  maxRate: Scalars['BigInt']['input'];
  minRate: Scalars['BigInt']['input'];
  startDate: Scalars['DateTime']['input'];
  termsDays?: InputMaybe<Scalars['Int']['input']>;
  volumeDiscount?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateBrokerInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  companyName: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateBrokerRateInput = {
  contractId: Scalars['ID']['input'];
  destState?: InputMaybe<Scalars['String']['input']>;
  effectiveDate: Scalars['DateTime']['input'];
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  laneDescription: Scalars['String']['input'];
  minimumCharge: Scalars['BigInt']['input'];
  originState?: InputMaybe<Scalars['String']['input']>;
  rate: Scalars['BigInt']['input'];
};

export type CreateCarrierAccessorialInput = {
  availableRegions: Array<Scalars['String']['input']>;
  carrierId: Scalars['ID']['input'];
  serviceCode: Scalars['String']['input'];
  serviceName: Scalars['String']['input'];
  unitRate: Scalars['BigInt']['input'];
  unitType: Scalars['String']['input'];
};

export type CreateCarrierInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  companyName: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  dotNumber: Scalars['String']['input'];
  email: Scalars['String']['input'];
  fleetTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  insuranceExpiryDate: Scalars['DateTime']['input'];
  insurancePolicyId: Scalars['String']['input'];
  insuranceProvider: Scalars['String']['input'];
  liabilityLimit: Scalars['BigInt']['input'];
  licenseExpiryDate: Scalars['DateTime']['input'];
  licenseNumber: Scalars['String']['input'];
  mcNumber: Scalars['String']['input'];
  operatingAuthority: CarrierAuthorityType;
  phone: Scalars['String']['input'];
  specializations?: InputMaybe<Array<Scalars['String']['input']>>;
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateCarrierRateInput = {
  baseRate: Scalars['BigInt']['input'];
  carrierId: Scalars['ID']['input'];
  destState?: InputMaybe<Scalars['String']['input']>;
  effectiveDate: Scalars['DateTime']['input'];
  laneDescription: Scalars['String']['input'];
  maxRate: Scalars['BigInt']['input'];
  minRate: Scalars['BigInt']['input'];
  originState?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDriverInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  licenseExpiryDate: Scalars['DateTime']['input'];
  licenseNumber: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type CreateFreightInput = {
  declaredValue?: InputMaybe<Scalars['BigInt']['input']>;
  hazmatClass?: InputMaybe<Scalars['String']['input']>;
  hazmatDescription?: InputMaybe<Scalars['String']['input']>;
  hazmatUNNumber?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  hsCode?: InputMaybe<Scalars['String']['input']>;
  isFragile?: InputMaybe<Scalars['Boolean']['input']>;
  isHazmat?: InputMaybe<Scalars['Boolean']['input']>;
  isPerishable?: InputMaybe<Scalars['Boolean']['input']>;
  isValueable?: InputMaybe<Scalars['Boolean']['input']>;
  length?: InputMaybe<Scalars['Float']['input']>;
  productDescription?: InputMaybe<Scalars['String']['input']>;
  productName: Scalars['String']['input'];
  productType: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  requiresHandling?: InputMaybe<Array<Scalars['String']['input']>>;
  temperatureMax?: InputMaybe<Scalars['Float']['input']>;
  temperatureMin?: InputMaybe<Scalars['Float']['input']>;
  totalWeight: Scalars['Float']['input'];
  unitType?: InputMaybe<Scalars['String']['input']>;
  unitWeight: Scalars['Float']['input'];
  volume: Scalars['Float']['input'];
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateFreightOwnerInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  companyName: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateShipmentDocumentInput = {
  documentNumber?: InputMaybe<Scalars['String']['input']>;
  documentType: Scalars['String']['input'];
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  fileName: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  issueDate?: InputMaybe<Scalars['DateTime']['input']>;
  shipmentId: Scalars['ID']['input'];
};

export type CreateShipmentEventInput = {
  eventCode: Scalars['String']['input'];
  eventDescription: Scalars['String']['input'];
  requiresAction?: InputMaybe<Scalars['Boolean']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  shipmentId: Scalars['ID']['input'];
};

export type CreateShipmentFreightInput = {
  freightId: Scalars['ID']['input'];
  sequenceNumber: Scalars['Int']['input'];
  shipmentId: Scalars['ID']['input'];
};

export type CreateShipmentInput = {
  deliveryScheduled: Scalars['DateTime']['input'];
  destinationWarehouseId?: InputMaybe<Scalars['String']['input']>;
  freightId: Scalars['ID']['input'];
  originWarehouseId: Scalars['String']['input'];
  ownerBudget?: InputMaybe<Scalars['BigInt']['input']>;
  pickupScheduled: Scalars['DateTime']['input'];
  poNumber?: InputMaybe<Scalars['String']['input']>;
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type CreateShipmentLogInput = {
  deviceId?: InputMaybe<Scalars['String']['input']>;
  eventType: Scalars['String']['input'];
  latitude?: InputMaybe<Scalars['Float']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  mileage?: InputMaybe<Scalars['Float']['input']>;
  shipmentId: Scalars['ID']['input'];
  temperature?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateShipmentStopInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  sequenceNumber: Scalars['Int']['input'];
  shipmentId: Scalars['ID']['input'];
  stopType: Scalars['String']['input'];
  warehouseId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateVehicleInput = {
  licensePlate: Scalars['String']['input'];
  make: Scalars['String']['input'];
  model: Scalars['String']['input'];
  vin: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type CreateWarehouseInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  state: Scalars['String']['input'];
  totalCapacityKg: Scalars['Float']['input'];
  zipCode: Scalars['String']['input'];
};

export type Driver = Node & {
  __typename?: 'Driver';
  carrier: Carrier;
  carrierId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  licenseExpiryDate: Scalars['DateTime']['output'];
  licenseNumber: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  status: DriverStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type DriverConnection = {
  __typename?: 'DriverConnection';
  items: Array<Driver>;
  pageInfo: PageInfo;
};

export enum DriverStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  OnLeave = 'ON_LEAVE',
  Terminated = 'TERMINATED'
}

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  extensions?: Maybe<Scalars['JSON']['output']>;
  message: Scalars['String']['output'];
};

export enum EventType {
  BiddingOpened = 'BIDDING_OPENED',
  BidAccepted = 'BID_ACCEPTED',
  BidSubmitted = 'BID_SUBMITTED',
  CancelledWithFee = 'CANCELLED_WITH_FEE',
  FreightClaimed = 'FREIGHT_CLAIMED',
  MarginLocked = 'MARGIN_LOCKED',
  PenaltyDistributed = 'PENALTY_DISTRIBUTED',
  ShipmentCreated = 'SHIPMENT_CREATED',
  StatusChanged = 'STATUS_CHANGED'
}

/**
 * Physical cargo awaiting transport
 * Locked to one broker at a time (CLAIMED status)
 * Rule #2: Single Broker Lock - one freight per broker
 */
export type Freight = Node & {
  __typename?: 'Freight';
  broker?: Maybe<Broker>;
  brokerId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentWarehouse?: Maybe<Warehouse>;
  currentWarehouseId?: Maybe<Scalars['String']['output']>;
  declaredValue?: Maybe<Scalars['BigInt']['output']>;
  freightNumber: Scalars['String']['output'];
  hazmatClass?: Maybe<Scalars['String']['output']>;
  hazmatDescription?: Maybe<Scalars['String']['output']>;
  hazmatUNNumber?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  hsCode?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFragile: Scalars['Boolean']['output'];
  isHazmat: Scalars['Boolean']['output'];
  isPerishable: Scalars['Boolean']['output'];
  isValueable: Scalars['Boolean']['output'];
  length?: Maybe<Scalars['Float']['output']>;
  owner: FreightOwner;
  ownerId: Scalars['String']['output'];
  productDescription?: Maybe<Scalars['String']['output']>;
  productName: Scalars['String']['output'];
  productType: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  requiresHandling: Array<Scalars['String']['output']>;
  shipments: Array<Shipment>;
  status: FreightStatus;
  storageEndDate?: Maybe<Scalars['DateTime']['output']>;
  storageStartDate?: Maybe<Scalars['DateTime']['output']>;
  temperatureMax?: Maybe<Scalars['Float']['output']>;
  temperatureMin?: Maybe<Scalars['Float']['output']>;
  totalWeight: Scalars['Float']['output'];
  unitType: Scalars['String']['output'];
  unitWeight: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  volume: Scalars['Float']['output'];
  width?: Maybe<Scalars['Float']['output']>;
};

export type FreightConnection = {
  __typename?: 'FreightConnection';
  items: Array<Freight>;
  pageInfo: PageInfo;
};

/**
 * Freight owner - cargo owner/shipper
 * Phase 1: Creates freight and defines specs
 * Rule #1: Real Loads Only
 */
export type FreightOwner = Node & {
  __typename?: 'FreightOwner';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  companyName: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  freights: Array<Freight>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  phone: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
  reviewCount: Scalars['Int']['output'];
  shipments: Array<Shipment>;
  state: Scalars['String']['output'];
  totalShipments: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  verificationStatus: VerificationStatus;
  zipCode: Scalars['String']['output'];
};

export type FreightOwnerConnection = {
  __typename?: 'FreightOwnerConnection';
  items: Array<FreightOwner>;
  pageInfo: PageInfo;
};

/**
 * Freight status progression
 * DRAFT → AVAILABLE → CLAIMED → ASSIGNED → COMPLETED
 */
export enum FreightStatus {
  Archived = 'ARCHIVED',
  Assigned = 'ASSIGNED',
  Available = 'AVAILABLE',
  Claimed = 'CLAIMED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT'
}

export type MaintenanceConnection = {
  __typename?: 'MaintenanceConnection';
  items: Array<MaintenanceRecord>;
  pageInfo: PageInfo;
};

export type MaintenanceInput = {
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  cost?: InputMaybe<Scalars['BigInt']['input']>;
  description: Scalars['String']['input'];
  maintenanceType: Scalars['String']['input'];
  nextScheduledDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type MaintenanceRecord = Node & {
  __typename?: 'MaintenanceRecord';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  cost?: Maybe<Scalars['BigInt']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maintenanceType: Scalars['String']['output'];
  nextScheduledDate?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  vehicle: Vehicle;
  vehicleId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Placeholder for resolver mutations */
  _empty?: Maybe<Scalars['String']['output']>;
  /**
   * Phase 6: Accept bid
   * Rule #5: Decision Deadline - 24h auto-accept if no decision
   */
  acceptBid: Shipment;
  /** Archive freight (soft delete) */
  archiveFreight: Freight;
  /**
   * Cancel shipment
   * Rule #7: Cancellation Penalties - 5-10% fee split to bidders
   */
  cancelShipment: Shipment;
  /**
   * Phase 2: Broker claims freight
   * Rule #2: Single Broker Lock
   * Sets status AVAILABLE → CLAIMED, locks brokerId
   */
  claimFreight: Freight;
  /**
   * Phase 4-5: Carrier submits bid
   * Rule #4: Bid Rules Auto-Validation - checked immediately
   */
  createBid: ShipmentBid;
  /**
   * Rule #4: Set bid rule for shipment (before bidding opens)
   * enforced=true: must pass (bid rejected if fails)
   * enforced=false: warning only (bid visible with flag)
   */
  createBidRule: BidRule;
  createBroker: Broker;
  createBrokerCarrierContract: BrokerCarrierContract;
  createBrokerRate: BrokerRate;
  /** Create new carrier account */
  createCarrier: Carrier;
  createCarrierAccessorial: CarrierAccessorial;
  createCarrierRate: CarrierRate;
  createDriver: Driver;
  /**
   * Phase 1: Owner creates freight
   * Rule #1: Real Loads Only - freight must exist before shipment
   */
  createFreight: Freight;
  createFreightOwner: FreightOwner;
  /** Create maintenance record, update vehicle status if needed */
  createMaintenanceRecord: MaintenanceRecord;
  /** Create review, update carrier rating */
  createReview: Review;
  /**
   * Phase 2: Broker creates shipment from freight
   * Rule #1: Real Loads Only - freight must exist and be AVAILABLE
   */
  createShipment: Shipment;
  createShipmentDocument: ShipmentDocument;
  createShipmentEvent: ShipmentEvent;
  createShipmentFreight: ShipmentFreight;
  createShipmentLog: ShipmentLog;
  createShipmentStop: ShipmentStop;
  createVehicle: Vehicle;
  createWarehouse: Warehouse;
  /** Delete bid rule (only before bidding opens) */
  deleteBidRule: Scalars['Boolean']['output'];
  deleteVehicle: Scalars['Boolean']['output'];
  /**
   * Phase 3: Open bidding and lock broker margin
   * Rule #3: Upfront Margin - margin agreed before bidding, immutable
   * Rule #5: Decision Deadline - 24h from first bid
   */
  openBidding: Shipment;
  /**
   * Rule #4: Override non-compliant bid
   * Broker accepts RULE_NON_COMPLIANT bid
   * Logged in audit trail
   */
  overrideBidRuleCompliance: ShipmentBid;
  /** Reject bid with reason */
  rejectBid: ShipmentBid;
  /**
   * Release freight claim
   * Reverts CLAIMED → AVAILABLE
   */
  releaseFreightClaim: Freight;
  /**
   * Phase 4-5: Carrier submits bid on shipment
   * Rule #4: Bid Rules Auto-Validation
   */
  submitBid: ShipmentBid;
  /** Update bid (only if status = PENDING) */
  updateBid: ShipmentBid;
  /** Update bid rule (only before bidding opens) */
  updateBidRule: BidRule;
  updateBroker: Broker;
  updateBrokerCarrierContract: BrokerCarrierContract;
  updateBrokerRate: BrokerRate;
  updateCapacity: Warehouse;
  /** Update carrier information */
  updateCarrier: Carrier;
  updateCarrierAccessorial: CarrierAccessorial;
  updateCarrierRate: CarrierRate;
  updateDriver: Driver;
  updateDriverStatus: Driver;
  /** Update freight details */
  updateFreight: Freight;
  updateFreightOwner: FreightOwner;
  /** Update review if allowed, recalculate carrier rating */
  updateReview: Review;
  /** Update shipment details */
  updateShipment: Shipment;
  updateShipmentDocument: ShipmentDocument;
  updateShipmentFreight: ShipmentFreight;
  updateShipmentStop: ShipmentStop;
  updateVehicle: Vehicle;
  updateVehicleStatus: Vehicle;
  updateWarehouse: Warehouse;
};


export type MutationAcceptBidArgs = {
  bidId: Scalars['ID']['input'];
  shipmentId: Scalars['ID']['input'];
};


export type MutationArchiveFreightArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelShipmentArgs = {
  reason: Scalars['String']['input'];
  shipmentId: Scalars['ID']['input'];
};


export type MutationClaimFreightArgs = {
  brokerId: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationCreateBidArgs = {
  input: BidInput;
  shipmentId: Scalars['ID']['input'];
};


export type MutationCreateBidRuleArgs = {
  input: BidRuleInput;
  shipmentId: Scalars['ID']['input'];
};


export type MutationCreateBrokerArgs = {
  input: CreateBrokerInput;
};


export type MutationCreateBrokerCarrierContractArgs = {
  input: CreateBrokerCarrierContractInput;
};


export type MutationCreateBrokerRateArgs = {
  input: CreateBrokerRateInput;
};


export type MutationCreateCarrierArgs = {
  input: CreateCarrierInput;
};


export type MutationCreateCarrierAccessorialArgs = {
  input: CreateCarrierAccessorialInput;
};


export type MutationCreateCarrierRateArgs = {
  input: CreateCarrierRateInput;
};


export type MutationCreateDriverArgs = {
  input: CreateDriverInput;
};


export type MutationCreateFreightArgs = {
  input: CreateFreightInput;
};


export type MutationCreateFreightOwnerArgs = {
  input: CreateFreightOwnerInput;
};


export type MutationCreateMaintenanceRecordArgs = {
  input: MaintenanceInput;
  vehicleId: Scalars['ID']['input'];
};


export type MutationCreateReviewArgs = {
  carrierId: Scalars['ID']['input'];
  input: ReviewInput;
};


export type MutationCreateShipmentArgs = {
  input: CreateShipmentInput;
};


export type MutationCreateShipmentDocumentArgs = {
  input: CreateShipmentDocumentInput;
};


export type MutationCreateShipmentEventArgs = {
  input: CreateShipmentEventInput;
};


export type MutationCreateShipmentFreightArgs = {
  input: CreateShipmentFreightInput;
};


export type MutationCreateShipmentLogArgs = {
  input: CreateShipmentLogInput;
};


export type MutationCreateShipmentStopArgs = {
  input: CreateShipmentStopInput;
};


export type MutationCreateVehicleArgs = {
  input: CreateVehicleInput;
};


export type MutationCreateWarehouseArgs = {
  input: CreateWarehouseInput;
};


export type MutationDeleteBidRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteVehicleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationOpenBiddingArgs = {
  brokerMarginPercent: Scalars['Float']['input'];
  shipmentId: Scalars['ID']['input'];
};


export type MutationOverrideBidRuleComplianceArgs = {
  bidId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectBidArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationReleaseFreightClaimArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSubmitBidArgs = {
  input: BidInput;
  rate: Scalars['BigInt']['input'];
  shipmentId: Scalars['ID']['input'];
};


export type MutationUpdateBidArgs = {
  id: Scalars['ID']['input'];
  input: BidInput;
};


export type MutationUpdateBidRuleArgs = {
  id: Scalars['ID']['input'];
  input: BidRuleInput;
};


export type MutationUpdateBrokerArgs = {
  id: Scalars['ID']['input'];
  input: CreateBrokerInput;
};


export type MutationUpdateBrokerCarrierContractArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBrokerCarrierContractInput;
};


export type MutationUpdateBrokerRateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBrokerRateInput;
};


export type MutationUpdateCapacityArgs = {
  capacityKg: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateCarrierArgs = {
  id: Scalars['ID']['input'];
  input: CreateCarrierInput;
};


export type MutationUpdateCarrierAccessorialArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCarrierAccessorialInput;
};


export type MutationUpdateCarrierRateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCarrierRateInput;
};


export type MutationUpdateDriverArgs = {
  id: Scalars['ID']['input'];
  input: CreateDriverInput;
};


export type MutationUpdateDriverStatusArgs = {
  id: Scalars['ID']['input'];
  status: DriverStatus;
};


export type MutationUpdateFreightArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFreightInput;
};


export type MutationUpdateFreightOwnerArgs = {
  id: Scalars['ID']['input'];
  input: CreateFreightOwnerInput;
};


export type MutationUpdateReviewArgs = {
  id: Scalars['ID']['input'];
  input: ReviewInput;
};


export type MutationUpdateShipmentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateShipmentInput;
};


export type MutationUpdateShipmentDocumentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateShipmentDocumentInput;
};


export type MutationUpdateShipmentFreightArgs = {
  id: Scalars['ID']['input'];
  input: UpdateShipmentFreightInput;
};


export type MutationUpdateShipmentStopArgs = {
  id: Scalars['ID']['input'];
  input: UpdateShipmentStopInput;
};


export type MutationUpdateVehicleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateVehicleInput;
};


export type MutationUpdateVehicleStatusArgs = {
  id: Scalars['ID']['input'];
  status: TruckStatus;
};


export type MutationUpdateWarehouseArgs = {
  id: Scalars['ID']['input'];
  input: UpdateWarehouseInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasMore: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PenaltyFilterInput = {
  shipmentId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

/** Penalty payment to bidder */
export type PenaltyPayment = Node & {
  __typename?: 'PenaltyPayment';
  amount: Scalars['BigInt']['output'];
  bidId: Scalars['ID']['output'];
  carrierId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Placeholder for resolver queries */
  _empty?: Maybe<Scalars['String']['output']>;
  /** Get single audit log entry */
  getAuditLog?: Maybe<ShipmentLog>;
  /** Get bid by ID */
  getBid?: Maybe<ShipmentBid>;
  /** Get bid rules for shipment */
  getBidRules: Array<BidRule>;
  getBroker?: Maybe<Broker>;
  getBrokerCarrierContract?: Maybe<BrokerCarrierContract>;
  getBrokerRate?: Maybe<BrokerRate>;
  /**
   * Rule #7: Get cancellation fee for shipment
   * POSTED: $0
   * BIDDING_OPEN: 5% fee
   * BID_SELECTED: 10% fee
   */
  getCancellationFee?: Maybe<CancellationFee>;
  /**
   * Get carrier by ID
   * Rule #10: Visible Assignment - broker/owner can see carrier details
   */
  getCarrier?: Maybe<Carrier>;
  getCarrierAccessorial?: Maybe<CarrierAccessorial>;
  /** Rule #10: Visible Assignment - get carrier average rating */
  getCarrierAverageRating: CarrierRating;
  getCarrierRate?: Maybe<CarrierRate>;
  /** Get compliance status for carrier */
  getComplianceStatus?: Maybe<ComplianceStatus>;
  getDriver?: Maybe<Driver>;
  /** Get freight by ID */
  getFreight?: Maybe<Freight>;
  /** Get freight audit trail */
  getFreightAuditTrail: AuditTrailConnection;
  /** Get freight by freight number */
  getFreightByNumber?: Maybe<Freight>;
  getFreightOwner?: Maybe<FreightOwner>;
  /** Get maintenance record by ID */
  getMaintenanceRecord?: Maybe<MaintenanceRecord>;
  /**
   * Get penalty distribution breakdown
   * Shows each bidder's compensation if cancelled
   */
  getPenaltyDistribution: Array<PenaltyPayment>;
  /** Get review by ID */
  getReview?: Maybe<Review>;
  /** Get shipment by ID */
  getShipment?: Maybe<Shipment>;
  /** Rule #9: Get complete audit trail for shipment (immutable, append-only) */
  getShipmentAuditTrail: AuditTrailConnection;
  /** Get shipment by shipment number */
  getShipmentByNumber?: Maybe<Shipment>;
  getShipmentDocument?: Maybe<ShipmentDocument>;
  getShipmentEvent?: Maybe<ShipmentEvent>;
  getShipmentFreight?: Maybe<ShipmentFreight>;
  getShipmentLog?: Maybe<ShipmentLog>;
  getShipmentStop?: Maybe<ShipmentStop>;
  getVehicle?: Maybe<Vehicle>;
  getWarehouse?: Maybe<Warehouse>;
  /** List all audit logs with pagination */
  listAuditLogs: AuditLogConnection;
  /**
   * List available freights (status = AVAILABLE)
   * Rule #1: Used by brokers to find cargo to claim
   */
  listAvailableFreights: FreightConnection;
  /** List all bids */
  listBids: BidConnection;
  /** List bids submitted by carrier */
  listBidsForCarrier: BidConnection;
  /** Rule #4: List bids for shipment (all visible with compliance status) */
  listBidsForShipment: BidConnection;
  listBrokerCarrierContracts: BrokerCarrierContractConnection;
  listBrokerRates: BrokerRateConnection;
  listBrokers: BrokerConnection;
  /** List all cancellation fees */
  listCancellationFees: CancellationFeeConnection;
  listCarrierAccessorials: CarrierAccessorialConnection;
  listCarrierRates: CarrierRateConnection;
  /** List all carriers with pagination */
  listCarriers: CarrierConnection;
  /** List carriers by minimum rating */
  listCarriersByRating: CarrierConnection;
  /** List all compliance issues */
  listComplianceIssues: ComplianceIssueConnection;
  listDrivers: DriverConnection;
  listDriversByCarrier: DriverConnection;
  listFreightOwners: FreightOwnerConnection;
  /** List all freights with pagination */
  listFreights: FreightConnection;
  /** List maintenance history for vehicle */
  listMaintenanceHistory: MaintenanceConnection;
  /** List all reviews */
  listReviews: ReviewConnection;
  /** List reviews for carrier */
  listReviewsForCarrier: ReviewConnection;
  listShipmentDocuments: ShipmentDocumentConnection;
  listShipmentEvents: ShipmentEventConnection;
  listShipmentFreights: ShipmentFreightConnection;
  listShipmentLogs: ShipmentLogConnection;
  listShipmentStops: ShipmentStopConnection;
  /** List all shipments with pagination */
  listShipments: ShipmentConnection;
  /** List shipments by broker (owner's perspective) */
  listShipmentsByBroker: ShipmentConnection;
  /** List shipments by carrier (bidding/assigned) */
  listShipmentsByCarrier: ShipmentConnection;
  listVehicles: VehicleConnection;
  listVehiclesByCarrier: VehicleConnection;
  listWarehouses: WarehouseConnection;
  me?: Maybe<User>;
  searchBrokers: BrokerConnection;
  /**
   * Search carriers by specializations, capacity, rating
   * Rule #10: Visible Assignment - show rating to all
   */
  searchCarriers: CarrierConnection;
  searchWarehouses: WarehouseConnection;
  users: UsersResult;
};


export type QueryGetAuditLogArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetBidArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetBidRulesArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type QueryGetBrokerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetBrokerCarrierContractArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetBrokerRateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCancellationFeeArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type QueryGetCarrierArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCarrierAccessorialArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCarrierAverageRatingArgs = {
  carrierId: Scalars['ID']['input'];
};


export type QueryGetCarrierRateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetComplianceStatusArgs = {
  carrierId: Scalars['ID']['input'];
};


export type QueryGetDriverArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetFreightArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetFreightAuditTrailArgs = {
  freightId: Scalars['ID']['input'];
  input: PaginationInput;
};


export type QueryGetFreightByNumberArgs = {
  number: Scalars['String']['input'];
};


export type QueryGetFreightOwnerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetMaintenanceRecordArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPenaltyDistributionArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type QueryGetReviewArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShipmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShipmentAuditTrailArgs = {
  input: PaginationInput;
  shipmentId: Scalars['ID']['input'];
};


export type QueryGetShipmentByNumberArgs = {
  number: Scalars['String']['input'];
};


export type QueryGetShipmentDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShipmentEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShipmentFreightArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShipmentLogArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShipmentStopArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVehicleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetWarehouseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListAuditLogsArgs = {
  input: PaginationInput;
};


export type QueryListAvailableFreightsArgs = {
  input: PaginationInput;
};


export type QueryListBidsArgs = {
  input: PaginationInput;
};


export type QueryListBidsForCarrierArgs = {
  carrierId: Scalars['String']['input'];
  input: PaginationInput;
};


export type QueryListBidsForShipmentArgs = {
  input: PaginationInput;
  shipmentId: Scalars['ID']['input'];
};


export type QueryListBrokerCarrierContractsArgs = {
  brokerId?: InputMaybe<Scalars['ID']['input']>;
  carrierId?: InputMaybe<Scalars['ID']['input']>;
  input: PaginationInput;
};


export type QueryListBrokerRatesArgs = {
  contractId: Scalars['ID']['input'];
  input: PaginationInput;
};


export type QueryListBrokersArgs = {
  input: PaginationInput;
};


export type QueryListCancellationFeesArgs = {
  input: PaginationInput;
};


export type QueryListCarrierAccessorialsArgs = {
  carrierId: Scalars['ID']['input'];
  input: PaginationInput;
};


export type QueryListCarrierRatesArgs = {
  carrierId: Scalars['ID']['input'];
  input: PaginationInput;
};


export type QueryListCarriersArgs = {
  input: PaginationInput;
};


export type QueryListCarriersByRatingArgs = {
  input: PaginationInput;
  minRating: Scalars['Float']['input'];
};


export type QueryListComplianceIssuesArgs = {
  input: PaginationInput;
};


export type QueryListDriversArgs = {
  input: PaginationInput;
};


export type QueryListDriversByCarrierArgs = {
  carrierId: Scalars['String']['input'];
  input: PaginationInput;
};


export type QueryListFreightOwnersArgs = {
  input: PaginationInput;
};


export type QueryListFreightsArgs = {
  input: PaginationInput;
};


export type QueryListMaintenanceHistoryArgs = {
  input: PaginationInput;
  vehicleId: Scalars['ID']['input'];
};


export type QueryListReviewsArgs = {
  input: PaginationInput;
};


export type QueryListReviewsForCarrierArgs = {
  carrierId: Scalars['String']['input'];
  input: PaginationInput;
};


export type QueryListShipmentDocumentsArgs = {
  input: PaginationInput;
  shipmentId: Scalars['ID']['input'];
};


export type QueryListShipmentEventsArgs = {
  input: PaginationInput;
  shipmentId: Scalars['ID']['input'];
};


export type QueryListShipmentFreightsArgs = {
  input: PaginationInput;
  shipmentId: Scalars['ID']['input'];
};


export type QueryListShipmentLogsArgs = {
  input: PaginationInput;
  shipmentId: Scalars['ID']['input'];
};


export type QueryListShipmentStopsArgs = {
  input: PaginationInput;
  shipmentId: Scalars['ID']['input'];
};


export type QueryListShipmentsArgs = {
  input: PaginationInput;
};


export type QueryListShipmentsByBrokerArgs = {
  brokerId: Scalars['String']['input'];
  input: PaginationInput;
};


export type QueryListShipmentsByCarrierArgs = {
  carrierId: Scalars['String']['input'];
  input: PaginationInput;
};


export type QueryListVehiclesArgs = {
  input: PaginationInput;
};


export type QueryListVehiclesByCarrierArgs = {
  carrierId: Scalars['String']['input'];
  input: PaginationInput;
};


export type QueryListWarehousesArgs = {
  input: PaginationInput;
};


export type QuerySearchBrokersArgs = {
  input: PaginationInput;
  rating?: InputMaybe<Scalars['Float']['input']>;
  specializations?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QuerySearchCarriersArgs = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  input: PaginationInput;
  rating?: InputMaybe<Scalars['Float']['input']>;
  specializations?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QuerySearchWarehousesArgs = {
  capacity?: InputMaybe<Scalars['Float']['input']>;
  input: PaginationInput;
  location?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  input: UsersInput;
};

export type Review = Node & {
  __typename?: 'Review';
  carrier: Carrier;
  carrierId: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Float']['output'];
  shippmentId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ReviewConnection = {
  __typename?: 'ReviewConnection';
  items: Array<Review>;
  pageInfo: PageInfo;
};

export type ReviewInput = {
  comment: Scalars['String']['input'];
  rating: Scalars['Float']['input'];
};

export enum RuleType {
  AccessHours = 'ACCESS_HOURS',
  CapacityMatch = 'CAPACITY_MATCH',
  EarlyConfirm = 'EARLY_CONFIRM',
  HazmatCertified = 'HAZMAT_CERTIFIED',
  HosClean = 'HOS_CLEAN',
  InsuranceAmount = 'INSURANCE_AMOUNT',
  LocationProximity = 'LOCATION_PROXIMITY',
  TemperatureControl = 'TEMPERATURE_CONTROL',
  VehicleAge = 'VEHICLE_AGE'
}

/**
 * Main orchestrator coordinating freight movement and bidding
 * Phases 2-11: Broker creates, opens bidding, selects carrier/warehouse, executes
 */
export type Shipment = Node & {
  __typename?: 'Shipment';
  acceptedBidId?: Maybe<Scalars['String']['output']>;
  actualCost?: Maybe<Scalars['BigInt']['output']>;
  actualMargin?: Maybe<Scalars['BigInt']['output']>;
  actualOD?: Maybe<Scalars['Float']['output']>;
  actualRevenue?: Maybe<Scalars['BigInt']['output']>;
  baseRate?: Maybe<Scalars['BigInt']['output']>;
  biddingOpenUntil?: Maybe<Scalars['DateTime']['output']>;
  biddingOpenedAt?: Maybe<Scalars['DateTime']['output']>;
  bids: Array<ShipmentBid>;
  broker: Broker;
  brokerId: Scalars['String']['output'];
  brokerMarginAmount?: Maybe<Scalars['BigInt']['output']>;
  brokerMarginPercent: Scalars['Float']['output'];
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  carrier?: Maybe<Carrier>;
  carrierId?: Maybe<Scalars['String']['output']>;
  carrierRate?: Maybe<Scalars['BigInt']['output']>;
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customerRate?: Maybe<Scalars['BigInt']['output']>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  deliveryActual?: Maybe<Scalars['DateTime']['output']>;
  deliveryScheduled: Scalars['DateTime']['output'];
  destinationWarehouse?: Maybe<Warehouse>;
  destinationWarehouseId?: Maybe<Scalars['String']['output']>;
  distance?: Maybe<Scalars['Float']['output']>;
  driver?: Maybe<Driver>;
  driverId?: Maybe<Scalars['String']['output']>;
  estimatedCost?: Maybe<Scalars['BigInt']['output']>;
  estimatedMargin?: Maybe<Scalars['BigInt']['output']>;
  estimatedOD?: Maybe<Scalars['Float']['output']>;
  estimatedRevenue?: Maybe<Scalars['BigInt']['output']>;
  events: Array<ShipmentEvent>;
  freights: Array<Freight>;
  fuelSurcharge: Scalars['Float']['output'];
  fuelSurchargeAmount: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  marketAdjustment: Scalars['BigInt']['output'];
  originWarehouse: Warehouse;
  originWarehouseId: Scalars['String']['output'];
  owner: FreightOwner;
  ownerBudget?: Maybe<Scalars['BigInt']['output']>;
  ownerId: Scalars['String']['output'];
  pickedUpAt?: Maybe<Scalars['DateTime']['output']>;
  pickupActual?: Maybe<Scalars['DateTime']['output']>;
  pickupScheduled: Scalars['DateTime']['output'];
  poNumber?: Maybe<Scalars['String']['output']>;
  referenceNumbers: Array<Scalars['String']['output']>;
  shipmentNumber: Scalars['String']['output'];
  specialInstructions?: Maybe<Scalars['String']['output']>;
  status: ShipmentStatus;
  surchargeRate: Scalars['BigInt']['output'];
  truck?: Maybe<Vehicle>;
  truckId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/**
 * Shipment bid from carrier
 * Rule #4: Bid Rules Auto-Validation - auto-checked against requirements
 */
export type ShipmentBid = Node & {
  __typename?: 'ShipmentBid';
  carrier: Carrier;
  carrierId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  estimatedDeliveryDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  insuranceAmount?: Maybe<Scalars['BigInt']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  rate: Scalars['BigInt']['output'];
  remarks?: Maybe<Scalars['String']['output']>;
  ruleComplianceStatus: BidStatus;
  shipment: Shipment;
  shipmentId: Scalars['ID']['output'];
  status: BidStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type ShipmentConnection = {
  __typename?: 'ShipmentConnection';
  items: Array<Shipment>;
  pageInfo: PageInfo;
};

export type ShipmentDocument = Node & {
  __typename?: 'ShipmentDocument';
  createdAt: Scalars['DateTime']['output'];
  documentNumber?: Maybe<Scalars['String']['output']>;
  documentType: Scalars['String']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  fileName: Scalars['String']['output'];
  fileSize?: Maybe<Scalars['Int']['output']>;
  fileUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  issueDate?: Maybe<Scalars['DateTime']['output']>;
  shipment: Shipment;
  uploadedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
  verifiedAt?: Maybe<Scalars['DateTime']['output']>;
  verifiedBy?: Maybe<Scalars['String']['output']>;
};

export type ShipmentDocumentConnection = {
  __typename?: 'ShipmentDocumentConnection';
  items: Array<ShipmentDocument>;
  pageInfo: PageInfo;
};

export type ShipmentEvent = Node & {
  __typename?: 'ShipmentEvent';
  actionDate?: Maybe<Scalars['DateTime']['output']>;
  actionTaken?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  eventCode: Scalars['String']['output'];
  eventDescription: Scalars['String']['output'];
  eventTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  requiresAction: Scalars['Boolean']['output'];
  severity: Scalars['String']['output'];
  shipment: Shipment;
  updatedAt: Scalars['DateTime']['output'];
};

export type ShipmentEventConnection = {
  __typename?: 'ShipmentEventConnection';
  items: Array<ShipmentEvent>;
  pageInfo: PageInfo;
};

export type ShipmentFreight = Node & {
  __typename?: 'ShipmentFreight';
  createdAt: Scalars['DateTime']['output'];
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  freight: Freight;
  id: Scalars['ID']['output'];
  pickedUpAt?: Maybe<Scalars['DateTime']['output']>;
  sequenceNumber: Scalars['Int']['output'];
  shipment: Shipment;
};

export type ShipmentFreightConnection = {
  __typename?: 'ShipmentFreightConnection';
  items: Array<ShipmentFreight>;
  pageInfo: PageInfo;
};

export type ShipmentLog = Node & {
  __typename?: 'ShipmentLog';
  createdAt: Scalars['DateTime']['output'];
  deviceId?: Maybe<Scalars['String']['output']>;
  eventTime: Scalars['DateTime']['output'];
  eventType: Scalars['String']['output'];
  fuelLevel?: Maybe<Scalars['String']['output']>;
  humidity?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  mileage?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  shipment: Shipment;
  temperature?: Maybe<Scalars['Float']['output']>;
};

export type ShipmentLogConnection = {
  __typename?: 'ShipmentLogConnection';
  items: Array<ShipmentLog>;
  pageInfo: PageInfo;
};

/**
 * Shipment status progression
 * DRAFT → POSTED → BIDDING_OPEN → BIDS_RECEIVED → BID_SELECTED → ASSIGNED → IN_TRANSIT → DELIVERED → COMPLETED
 */
export enum ShipmentStatus {
  Assigned = 'ASSIGNED',
  BiddingOpen = 'BIDDING_OPEN',
  BidsReceived = 'BIDS_RECEIVED',
  BidSelected = 'BID_SELECTED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Delivered = 'DELIVERED',
  Disputed = 'DISPUTED',
  Draft = 'DRAFT',
  InTransit = 'IN_TRANSIT',
  Posted = 'POSTED'
}

export type ShipmentStatusEvent = {
  __typename?: 'ShipmentStatusEvent';
  newStatus: ShipmentStatus;
  oldStatus: ShipmentStatus;
  shipmentId: Scalars['ID']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type ShipmentStop = Node & {
  __typename?: 'ShipmentStop';
  address?: Maybe<Scalars['String']['output']>;
  arrivedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  departedAt?: Maybe<Scalars['DateTime']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  sequenceNumber: Scalars['Int']['output'];
  shipment: Shipment;
  stopType: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  warehouse?: Maybe<Warehouse>;
};

export type ShipmentStopConnection = {
  __typename?: 'ShipmentStopConnection';
  items: Array<ShipmentStop>;
  pageInfo: PageInfo;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Placeholder for resolver subscriptions */
  _empty?: Maybe<Scalars['String']['output']>;
  /** Real-time: Bid accepted */
  bidAccepted: BidAcceptedEvent;
  /**
   * Real-time: New bid received
   * Rule #4: Bid Rules Auto-Validation - bid visible with compliance status
   */
  bidReceived: BidReceivedEvent;
  /**
   * Real-time: New bid received on shipment
   * Rule #4: Compliance status included
   */
  newBidReceived: ShipmentBid;
  /** Real-time: Shipment status changes */
  shipmentStatusChanged: ShipmentStatusEvent;
};


export type SubscriptionBidAcceptedArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type SubscriptionBidReceivedArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type SubscriptionNewBidReceivedArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type SubscriptionShipmentStatusChangedArgs = {
  shipmentId: Scalars['ID']['input'];
};

export enum TruckStatus {
  Available = 'AVAILABLE',
  InMaintenance = 'IN_MAINTENANCE',
  InTransit = 'IN_TRANSIT',
  OutOfService = 'OUT_OF_SERVICE'
}

export type UpdateBrokerCarrierContractInput = {
  defaultRate?: InputMaybe<Scalars['BigInt']['input']>;
  maxRate?: InputMaybe<Scalars['BigInt']['input']>;
  minRate?: InputMaybe<Scalars['BigInt']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  volumeDiscount?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateBrokerRateInput = {
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  minimumCharge?: InputMaybe<Scalars['BigInt']['input']>;
  rate?: InputMaybe<Scalars['BigInt']['input']>;
};

export type UpdateCarrierAccessorialInput = {
  availableRegions?: InputMaybe<Array<Scalars['String']['input']>>;
  isApproved?: InputMaybe<Scalars['Boolean']['input']>;
  serviceName?: InputMaybe<Scalars['String']['input']>;
  unitRate?: InputMaybe<Scalars['BigInt']['input']>;
};

export type UpdateCarrierRateInput = {
  baseRate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  maxRate?: InputMaybe<Scalars['BigInt']['input']>;
  minRate?: InputMaybe<Scalars['BigInt']['input']>;
};

export type UpdateFreightInput = {
  declaredValue?: InputMaybe<Scalars['BigInt']['input']>;
  productDescription?: InputMaybe<Scalars['String']['input']>;
  productName?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  temperatureMax?: InputMaybe<Scalars['Float']['input']>;
  temperatureMin?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateShipmentDocumentInput = {
  verified?: InputMaybe<Scalars['Boolean']['input']>;
  verifiedBy?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShipmentFreightInput = {
  deliveredAt?: InputMaybe<Scalars['DateTime']['input']>;
  pickedUpAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateShipmentInput = {
  deliveryScheduled?: InputMaybe<Scalars['DateTime']['input']>;
  pickupScheduled?: InputMaybe<Scalars['DateTime']['input']>;
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShipmentStopInput = {
  arrivedAt?: InputMaybe<Scalars['DateTime']['input']>;
  departedAt?: InputMaybe<Scalars['DateTime']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVehicleInput = {
  licensePlate?: InputMaybe<Scalars['String']['input']>;
  make?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWarehouseInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRole>;
  status: UserStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'admin',
  Broker = 'broker',
  Carrier = 'carrier',
  Driver = 'driver',
  Warehouse = 'warehouse'
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
  Suspended = 'suspended'
}

export type UsersInput = {
  createdAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore?: InputMaybe<Scalars['DateTime']['input']>;
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
  status?: InputMaybe<UserStatus>;
};

export type UsersResult = {
  __typename?: 'UsersResult';
  pageInfo: PageInfo;
  users: Array<User>;
};

export type Vehicle = Node & {
  __typename?: 'Vehicle';
  carrier: Carrier;
  carrierId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentDriver?: Maybe<Driver>;
  driverId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  licensePlate: Scalars['String']['output'];
  make: Scalars['String']['output'];
  model: Scalars['String']['output'];
  status: TruckStatus;
  updatedAt: Scalars['DateTime']['output'];
  vin: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type VehicleConnection = {
  __typename?: 'VehicleConnection';
  items: Array<Vehicle>;
  pageInfo: PageInfo;
};

export enum VerificationStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Suspended = 'SUSPENDED',
  Verified = 'VERIFIED'
}

export type Warehouse = Node & {
  __typename?: 'Warehouse';
  address: Scalars['String']['output'];
  availableCapacityKg: Scalars['Float']['output'];
  capacityUtilization: Scalars['Float']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  rating: Scalars['Float']['output'];
  reviewCount: Scalars['Int']['output'];
  state: Scalars['String']['output'];
  totalCapacityKg: Scalars['Float']['output'];
  totalShipments: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  usedCapacityKg: Scalars['Float']['output'];
  verificationStatus: VerificationStatus;
  zipCode: Scalars['String']['output'];
};

export type WarehouseConnection = {
  __typename?: 'WarehouseConnection';
  items: Array<Warehouse>;
  pageInfo: PageInfo;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, name?: string | null, email: string, image?: string | null, status: UserStatus, createdAt: Date, updatedAt: Date } | null };

export type UsersQueryVariables = Exact<{
  input: UsersInput;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UsersResult', users: Array<{ __typename?: 'User', id: string, email: string, name?: string | null, status: UserStatus, image?: string | null, createdAt: Date, updatedAt: Date }>, pageInfo: { __typename?: 'PageInfo', total: number, offset: number, limit: number } } };


export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UsersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;