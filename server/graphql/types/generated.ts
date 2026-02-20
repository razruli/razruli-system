import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { UserModel, FreightOwnerModel, BrokerModel, CarrierModel, WarehouseModel, DriverModel, FreightModel, ShipmentModel, TruckModel, ShipmentBidModel, BidRuleModel, BidRequirementModel, WarehouseNeedModel, WarehouseBidModel } from '../../db/generated/prisma/models';
import { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  endDate: InputMaybe<Scalars['DateTime']['input']>;
  eventType: InputMaybe<EventType>;
  freightId: InputMaybe<Scalars['ID']['input']>;
  shipmentId: InputMaybe<Scalars['ID']['input']>;
  startDate: InputMaybe<Scalars['DateTime']['input']>;
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
  estimatedDeliveryDate: InputMaybe<Scalars['DateTime']['input']>;
  insuranceAmount: InputMaybe<Scalars['BigInt']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
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
  reason: Maybe<Scalars['String']['output']>;
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
  enforced: InputMaybe<Scalars['Boolean']['input']>;
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
  endDate: Maybe<Scalars['DateTime']['output']>;
  fuelSurchargeFormula: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maxRate: Scalars['BigInt']['output'];
  minRate: Scalars['BigInt']['output'];
  notes: Maybe<Scalars['String']['output']>;
  paymentTerms: Scalars['String']['output'];
  rates: Array<BrokerRate>;
  startDate: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  termsDays: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  volumeDiscount: Scalars['Float']['output'];
  volumeThreshold: Maybe<Scalars['Int']['output']>;
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
  destCity: Maybe<Scalars['String']['output']>;
  destState: Maybe<Scalars['String']['output']>;
  effectiveDate: Scalars['DateTime']['output'];
  expiryDate: Maybe<Scalars['DateTime']['output']>;
  freightClassMax: Maybe<Scalars['Int']['output']>;
  freightClassMin: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  laneDescription: Maybe<Scalars['String']['output']>;
  minimumCharge: Scalars['BigInt']['output'];
  originCity: Maybe<Scalars['String']['output']>;
  originState: Maybe<Scalars['String']['output']>;
  rate: Scalars['BigInt']['output'];
  updatedAt: Scalars['DateTime']['output'];
  weightMax: Maybe<Scalars['Float']['output']>;
  weightMin: Maybe<Scalars['Float']['output']>;
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
  distributedAt: Maybe<Scalars['DateTime']['output']>;
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
  averageFleetAge: Maybe<Scalars['Int']['output']>;
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
  serviceDescription: Maybe<Scalars['String']['output']>;
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
  costPerMile: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deadheadCost: Maybe<Scalars['BigInt']['output']>;
  destCity: Maybe<Scalars['String']['output']>;
  destState: Maybe<Scalars['String']['output']>;
  effectiveDate: Scalars['DateTime']['output'];
  expiryDate: Maybe<Scalars['DateTime']['output']>;
  freightClassMax: Maybe<Scalars['Int']['output']>;
  freightClassMin: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  laneDescription: Maybe<Scalars['String']['output']>;
  maxRate: Scalars['BigInt']['output'];
  minRate: Scalars['BigInt']['output'];
  originCity: Maybe<Scalars['String']['output']>;
  originState: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  weightMax: Maybe<Scalars['Float']['output']>;
  weightMin: Maybe<Scalars['Float']['output']>;
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
  severity: InputMaybe<Scalars['String']['input']>;
};

export type ComplianceIssue = Node & {
  __typename?: 'ComplianceIssue';
  carrierId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  issueType: Scalars['String']['output'];
  resolvedAt: Maybe<Scalars['DateTime']['output']>;
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
  endDate: InputMaybe<Scalars['DateTime']['input']>;
  maxRate: Scalars['BigInt']['input'];
  minRate: Scalars['BigInt']['input'];
  startDate: Scalars['DateTime']['input'];
  termsDays: InputMaybe<Scalars['Int']['input']>;
  volumeDiscount: InputMaybe<Scalars['Float']['input']>;
};

export type CreateBrokerInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  companyName: Scalars['String']['input'];
  country: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateBrokerRateInput = {
  contractId: Scalars['ID']['input'];
  destState: InputMaybe<Scalars['String']['input']>;
  effectiveDate: Scalars['DateTime']['input'];
  expiryDate: InputMaybe<Scalars['DateTime']['input']>;
  laneDescription: Scalars['String']['input'];
  minimumCharge: Scalars['BigInt']['input'];
  originState: InputMaybe<Scalars['String']['input']>;
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
  country: InputMaybe<Scalars['String']['input']>;
  dotNumber: Scalars['String']['input'];
  email: Scalars['String']['input'];
  fleetTypes: InputMaybe<Array<Scalars['String']['input']>>;
  insuranceExpiryDate: Scalars['DateTime']['input'];
  insurancePolicyId: Scalars['String']['input'];
  insuranceProvider: Scalars['String']['input'];
  liabilityLimit: Scalars['BigInt']['input'];
  licenseExpiryDate: Scalars['DateTime']['input'];
  licenseNumber: Scalars['String']['input'];
  mcNumber: Scalars['String']['input'];
  operatingAuthority: CarrierAuthorityType;
  phone: Scalars['String']['input'];
  specializations: InputMaybe<Array<Scalars['String']['input']>>;
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateCarrierRateInput = {
  baseRate: Scalars['BigInt']['input'];
  carrierId: Scalars['ID']['input'];
  destState: InputMaybe<Scalars['String']['input']>;
  effectiveDate: Scalars['DateTime']['input'];
  laneDescription: Scalars['String']['input'];
  maxRate: Scalars['BigInt']['input'];
  minRate: Scalars['BigInt']['input'];
  originState: InputMaybe<Scalars['String']['input']>;
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
  declaredValue: InputMaybe<Scalars['BigInt']['input']>;
  hazmatClass: InputMaybe<Scalars['String']['input']>;
  hazmatDescription: InputMaybe<Scalars['String']['input']>;
  hazmatUNNumber: InputMaybe<Scalars['String']['input']>;
  height: InputMaybe<Scalars['Float']['input']>;
  hsCode: InputMaybe<Scalars['String']['input']>;
  isFragile: InputMaybe<Scalars['Boolean']['input']>;
  isHazmat: InputMaybe<Scalars['Boolean']['input']>;
  isPerishable: InputMaybe<Scalars['Boolean']['input']>;
  isValueable: InputMaybe<Scalars['Boolean']['input']>;
  length: InputMaybe<Scalars['Float']['input']>;
  productDescription: InputMaybe<Scalars['String']['input']>;
  productName: Scalars['String']['input'];
  productType: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  requiresHandling: InputMaybe<Array<Scalars['String']['input']>>;
  temperatureMax: InputMaybe<Scalars['Float']['input']>;
  temperatureMin: InputMaybe<Scalars['Float']['input']>;
  totalWeight: Scalars['Float']['input'];
  unitType: InputMaybe<Scalars['String']['input']>;
  unitWeight: Scalars['Float']['input'];
  volume: Scalars['Float']['input'];
  width: InputMaybe<Scalars['Float']['input']>;
};

export type CreateFreightOwnerInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  companyName: Scalars['String']['input'];
  country: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

export type CreateShipmentDocumentInput = {
  documentNumber: InputMaybe<Scalars['String']['input']>;
  documentType: Scalars['String']['input'];
  expiryDate: InputMaybe<Scalars['DateTime']['input']>;
  fileName: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  issueDate: InputMaybe<Scalars['DateTime']['input']>;
  shipmentId: Scalars['ID']['input'];
};

export type CreateShipmentEventInput = {
  eventCode: Scalars['String']['input'];
  eventDescription: Scalars['String']['input'];
  requiresAction: InputMaybe<Scalars['Boolean']['input']>;
  severity: InputMaybe<Scalars['String']['input']>;
  shipmentId: Scalars['ID']['input'];
};

export type CreateShipmentFreightInput = {
  freightId: Scalars['ID']['input'];
  sequenceNumber: Scalars['Int']['input'];
  shipmentId: Scalars['ID']['input'];
};

export type CreateShipmentInput = {
  deliveryScheduled: Scalars['DateTime']['input'];
  destinationWarehouseId: InputMaybe<Scalars['String']['input']>;
  freightId: Scalars['ID']['input'];
  originWarehouseId: Scalars['String']['input'];
  ownerBudget: InputMaybe<Scalars['BigInt']['input']>;
  pickupScheduled: Scalars['DateTime']['input'];
  poNumber: InputMaybe<Scalars['String']['input']>;
  specialInstructions: InputMaybe<Scalars['String']['input']>;
};

export type CreateShipmentLogInput = {
  deviceId: InputMaybe<Scalars['String']['input']>;
  eventType: Scalars['String']['input'];
  latitude: InputMaybe<Scalars['Float']['input']>;
  location: InputMaybe<Scalars['String']['input']>;
  longitude: InputMaybe<Scalars['Float']['input']>;
  mileage: InputMaybe<Scalars['Float']['input']>;
  shipmentId: Scalars['ID']['input'];
  temperature: InputMaybe<Scalars['Float']['input']>;
};

export type CreateShipmentStopInput = {
  address: InputMaybe<Scalars['String']['input']>;
  latitude: InputMaybe<Scalars['Float']['input']>;
  longitude: InputMaybe<Scalars['Float']['input']>;
  sequenceNumber: Scalars['Int']['input'];
  shipmentId: Scalars['ID']['input'];
  stopType: Scalars['String']['input'];
  warehouseId: InputMaybe<Scalars['ID']['input']>;
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
  country: InputMaybe<Scalars['String']['input']>;
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
  extensions: Maybe<Scalars['JSON']['output']>;
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
  broker: Maybe<Broker>;
  brokerId: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentWarehouse: Maybe<Warehouse>;
  currentWarehouseId: Maybe<Scalars['String']['output']>;
  declaredValue: Maybe<Scalars['BigInt']['output']>;
  freightNumber: Scalars['String']['output'];
  hazmatClass: Maybe<Scalars['String']['output']>;
  hazmatDescription: Maybe<Scalars['String']['output']>;
  hazmatUNNumber: Maybe<Scalars['String']['output']>;
  height: Maybe<Scalars['Float']['output']>;
  hsCode: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFragile: Scalars['Boolean']['output'];
  isHazmat: Scalars['Boolean']['output'];
  isPerishable: Scalars['Boolean']['output'];
  isValueable: Scalars['Boolean']['output'];
  length: Maybe<Scalars['Float']['output']>;
  owner: FreightOwner;
  ownerId: Scalars['String']['output'];
  productDescription: Maybe<Scalars['String']['output']>;
  productName: Scalars['String']['output'];
  productType: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  requiresHandling: Array<Scalars['String']['output']>;
  shipments: Array<Shipment>;
  status: FreightStatus;
  storageEndDate: Maybe<Scalars['DateTime']['output']>;
  storageStartDate: Maybe<Scalars['DateTime']['output']>;
  temperatureMax: Maybe<Scalars['Float']['output']>;
  temperatureMin: Maybe<Scalars['Float']['output']>;
  totalWeight: Scalars['Float']['output'];
  unitType: Scalars['String']['output'];
  unitWeight: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  volume: Scalars['Float']['output'];
  width: Maybe<Scalars['Float']['output']>;
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
  completedAt: InputMaybe<Scalars['DateTime']['input']>;
  cost: InputMaybe<Scalars['BigInt']['input']>;
  description: Scalars['String']['input'];
  maintenanceType: Scalars['String']['input'];
  nextScheduledDate: InputMaybe<Scalars['DateTime']['input']>;
};

export type MaintenanceRecord = Node & {
  __typename?: 'MaintenanceRecord';
  completedAt: Maybe<Scalars['DateTime']['output']>;
  cost: Maybe<Scalars['BigInt']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maintenanceType: Scalars['String']['output'];
  nextScheduledDate: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  vehicle: Vehicle;
  vehicleId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Placeholder for resolver mutations */
  _empty: Maybe<Scalars['String']['output']>;
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
  reason: InputMaybe<Scalars['String']['input']>;
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
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
};

export type PenaltyFilterInput = {
  shipmentId: Scalars['ID']['input'];
  status: InputMaybe<Scalars['String']['input']>;
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
  _empty: Maybe<Scalars['String']['output']>;
  /** Get single audit log entry */
  getAuditLog: Maybe<ShipmentLog>;
  /** Get bid by ID */
  getBid: Maybe<ShipmentBid>;
  /** Get bid rules for shipment */
  getBidRules: Array<BidRule>;
  getBroker: Maybe<Broker>;
  getBrokerCarrierContract: Maybe<BrokerCarrierContract>;
  getBrokerRate: Maybe<BrokerRate>;
  /**
   * Rule #7: Get cancellation fee for shipment
   * POSTED: $0
   * BIDDING_OPEN: 5% fee
   * BID_SELECTED: 10% fee
   */
  getCancellationFee: Maybe<CancellationFee>;
  /**
   * Get carrier by ID
   * Rule #10: Visible Assignment - broker/owner can see carrier details
   */
  getCarrier: Maybe<Carrier>;
  getCarrierAccessorial: Maybe<CarrierAccessorial>;
  /** Rule #10: Visible Assignment - get carrier average rating */
  getCarrierAverageRating: CarrierRating;
  getCarrierRate: Maybe<CarrierRate>;
  /** Get compliance status for carrier */
  getComplianceStatus: Maybe<ComplianceStatus>;
  getDriver: Maybe<Driver>;
  /** Get freight by ID */
  getFreight: Maybe<Freight>;
  /** Get freight audit trail */
  getFreightAuditTrail: AuditTrailConnection;
  /** Get freight by freight number */
  getFreightByNumber: Maybe<Freight>;
  getFreightOwner: Maybe<FreightOwner>;
  /** Get maintenance record by ID */
  getMaintenanceRecord: Maybe<MaintenanceRecord>;
  /**
   * Get penalty distribution breakdown
   * Shows each bidder's compensation if cancelled
   */
  getPenaltyDistribution: Array<PenaltyPayment>;
  /** Get review by ID */
  getReview: Maybe<Review>;
  /** Get shipment by ID */
  getShipment: Maybe<Shipment>;
  /** Rule #9: Get complete audit trail for shipment (immutable, append-only) */
  getShipmentAuditTrail: AuditTrailConnection;
  /** Get shipment by shipment number */
  getShipmentByNumber: Maybe<Shipment>;
  getShipmentDocument: Maybe<ShipmentDocument>;
  getShipmentEvent: Maybe<ShipmentEvent>;
  getShipmentFreight: Maybe<ShipmentFreight>;
  getShipmentLog: Maybe<ShipmentLog>;
  getShipmentStop: Maybe<ShipmentStop>;
  getVehicle: Maybe<Vehicle>;
  getWarehouse: Maybe<Warehouse>;
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
  me: Maybe<User>;
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
  brokerId: InputMaybe<Scalars['ID']['input']>;
  carrierId: InputMaybe<Scalars['ID']['input']>;
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
  rating: InputMaybe<Scalars['Float']['input']>;
  specializations: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QuerySearchCarriersArgs = {
  capacity: InputMaybe<Scalars['Int']['input']>;
  input: PaginationInput;
  rating: InputMaybe<Scalars['Float']['input']>;
  specializations: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QuerySearchWarehousesArgs = {
  capacity: InputMaybe<Scalars['Float']['input']>;
  input: PaginationInput;
  location: InputMaybe<Scalars['String']['input']>;
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
  shippmentId: Maybe<Scalars['String']['output']>;
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
  acceptedBidId: Maybe<Scalars['String']['output']>;
  actualCost: Maybe<Scalars['BigInt']['output']>;
  actualMargin: Maybe<Scalars['BigInt']['output']>;
  actualOD: Maybe<Scalars['Float']['output']>;
  actualRevenue: Maybe<Scalars['BigInt']['output']>;
  baseRate: Maybe<Scalars['BigInt']['output']>;
  biddingOpenUntil: Maybe<Scalars['DateTime']['output']>;
  biddingOpenedAt: Maybe<Scalars['DateTime']['output']>;
  bids: Array<ShipmentBid>;
  broker: Broker;
  brokerId: Scalars['String']['output'];
  brokerMarginAmount: Maybe<Scalars['BigInt']['output']>;
  brokerMarginPercent: Scalars['Float']['output'];
  cancelledAt: Maybe<Scalars['DateTime']['output']>;
  carrier: Maybe<Carrier>;
  carrierId: Maybe<Scalars['String']['output']>;
  carrierRate: Maybe<Scalars['BigInt']['output']>;
  confirmedAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customerRate: Maybe<Scalars['BigInt']['output']>;
  deliveredAt: Maybe<Scalars['DateTime']['output']>;
  deliveryActual: Maybe<Scalars['DateTime']['output']>;
  deliveryScheduled: Scalars['DateTime']['output'];
  destinationWarehouse: Maybe<Warehouse>;
  destinationWarehouseId: Maybe<Scalars['String']['output']>;
  distance: Maybe<Scalars['Float']['output']>;
  driver: Maybe<Driver>;
  driverId: Maybe<Scalars['String']['output']>;
  estimatedCost: Maybe<Scalars['BigInt']['output']>;
  estimatedMargin: Maybe<Scalars['BigInt']['output']>;
  estimatedOD: Maybe<Scalars['Float']['output']>;
  estimatedRevenue: Maybe<Scalars['BigInt']['output']>;
  events: Array<ShipmentEvent>;
  freights: Array<Freight>;
  fuelSurcharge: Scalars['Float']['output'];
  fuelSurchargeAmount: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  marketAdjustment: Scalars['BigInt']['output'];
  originWarehouse: Warehouse;
  originWarehouseId: Scalars['String']['output'];
  owner: FreightOwner;
  ownerBudget: Maybe<Scalars['BigInt']['output']>;
  ownerId: Scalars['String']['output'];
  pickedUpAt: Maybe<Scalars['DateTime']['output']>;
  pickupActual: Maybe<Scalars['DateTime']['output']>;
  pickupScheduled: Scalars['DateTime']['output'];
  poNumber: Maybe<Scalars['String']['output']>;
  referenceNumbers: Array<Scalars['String']['output']>;
  shipmentNumber: Scalars['String']['output'];
  specialInstructions: Maybe<Scalars['String']['output']>;
  status: ShipmentStatus;
  surchargeRate: Scalars['BigInt']['output'];
  truck: Maybe<Vehicle>;
  truckId: Maybe<Scalars['String']['output']>;
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
  estimatedDeliveryDate: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  insuranceAmount: Maybe<Scalars['BigInt']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  rate: Scalars['BigInt']['output'];
  remarks: Maybe<Scalars['String']['output']>;
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
  documentNumber: Maybe<Scalars['String']['output']>;
  documentType: Scalars['String']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  expiryDate: Maybe<Scalars['DateTime']['output']>;
  fileName: Scalars['String']['output'];
  fileSize: Maybe<Scalars['Int']['output']>;
  fileUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  issueDate: Maybe<Scalars['DateTime']['output']>;
  shipment: Shipment;
  uploadedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
  verifiedAt: Maybe<Scalars['DateTime']['output']>;
  verifiedBy: Maybe<Scalars['String']['output']>;
};

export type ShipmentDocumentConnection = {
  __typename?: 'ShipmentDocumentConnection';
  items: Array<ShipmentDocument>;
  pageInfo: PageInfo;
};

export type ShipmentEvent = Node & {
  __typename?: 'ShipmentEvent';
  actionDate: Maybe<Scalars['DateTime']['output']>;
  actionTaken: Maybe<Scalars['String']['output']>;
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
  deliveredAt: Maybe<Scalars['DateTime']['output']>;
  freight: Freight;
  id: Scalars['ID']['output'];
  pickedUpAt: Maybe<Scalars['DateTime']['output']>;
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
  deviceId: Maybe<Scalars['String']['output']>;
  eventTime: Scalars['DateTime']['output'];
  eventType: Scalars['String']['output'];
  fuelLevel: Maybe<Scalars['String']['output']>;
  humidity: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  latitude: Maybe<Scalars['Float']['output']>;
  location: Maybe<Scalars['String']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
  mileage: Maybe<Scalars['Float']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  shipment: Shipment;
  temperature: Maybe<Scalars['Float']['output']>;
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
  address: Maybe<Scalars['String']['output']>;
  arrivedAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  departedAt: Maybe<Scalars['DateTime']['output']>;
  duration: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  latitude: Maybe<Scalars['Float']['output']>;
  longitude: Maybe<Scalars['Float']['output']>;
  notes: Maybe<Scalars['String']['output']>;
  sequenceNumber: Scalars['Int']['output'];
  shipment: Shipment;
  stopType: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  warehouse: Maybe<Warehouse>;
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
  _empty: Maybe<Scalars['String']['output']>;
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
  defaultRate: InputMaybe<Scalars['BigInt']['input']>;
  maxRate: InputMaybe<Scalars['BigInt']['input']>;
  minRate: InputMaybe<Scalars['BigInt']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
  volumeDiscount: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateBrokerRateInput = {
  expiryDate: InputMaybe<Scalars['DateTime']['input']>;
  minimumCharge: InputMaybe<Scalars['BigInt']['input']>;
  rate: InputMaybe<Scalars['BigInt']['input']>;
};

export type UpdateCarrierAccessorialInput = {
  availableRegions: InputMaybe<Array<Scalars['String']['input']>>;
  isApproved: InputMaybe<Scalars['Boolean']['input']>;
  serviceName: InputMaybe<Scalars['String']['input']>;
  unitRate: InputMaybe<Scalars['BigInt']['input']>;
};

export type UpdateCarrierRateInput = {
  baseRate: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate: InputMaybe<Scalars['DateTime']['input']>;
  maxRate: InputMaybe<Scalars['BigInt']['input']>;
  minRate: InputMaybe<Scalars['BigInt']['input']>;
};

export type UpdateFreightInput = {
  declaredValue: InputMaybe<Scalars['BigInt']['input']>;
  productDescription: InputMaybe<Scalars['String']['input']>;
  productName: InputMaybe<Scalars['String']['input']>;
  quantity: InputMaybe<Scalars['Int']['input']>;
  temperatureMax: InputMaybe<Scalars['Float']['input']>;
  temperatureMin: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateShipmentDocumentInput = {
  verified: InputMaybe<Scalars['Boolean']['input']>;
  verifiedBy: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShipmentFreightInput = {
  deliveredAt: InputMaybe<Scalars['DateTime']['input']>;
  pickedUpAt: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateShipmentInput = {
  deliveryScheduled: InputMaybe<Scalars['DateTime']['input']>;
  pickupScheduled: InputMaybe<Scalars['DateTime']['input']>;
  specialInstructions: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShipmentStopInput = {
  arrivedAt: InputMaybe<Scalars['DateTime']['input']>;
  departedAt: InputMaybe<Scalars['DateTime']['input']>;
  notes: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVehicleInput = {
  licensePlate: InputMaybe<Scalars['String']['input']>;
  make: InputMaybe<Scalars['String']['input']>;
  model: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWarehouseInput = {
  address: InputMaybe<Scalars['String']['input']>;
  email: InputMaybe<Scalars['String']['input']>;
  phone: InputMaybe<Scalars['String']['input']>;
};

export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  role: Maybe<UserRole>;
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
  createdAfter: InputMaybe<Scalars['DateTime']['input']>;
  createdBefore: InputMaybe<Scalars['DateTime']['input']>;
  emailVerified: InputMaybe<Scalars['Boolean']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  sortBy: InputMaybe<Scalars['String']['input']>;
  sortOrder: InputMaybe<SortOrder>;
  status: InputMaybe<UserStatus>;
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
  currentDriver: Maybe<Driver>;
  driverId: Maybe<Scalars['String']['output']>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;




/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Node:
    | ( BidRequirementModel )
    | ( BidRuleModel )
    | ( BrokerModel )
    | ( Omit<BrokerCarrierContract, 'broker' | 'carrier' | 'rates'> & { broker: _RefType['Broker'], carrier: _RefType['Carrier'], rates: Array<_RefType['BrokerRate']> } )
    | ( Omit<BrokerRate, 'contract'> & { contract: _RefType['BrokerCarrierContract'] } )
    | ( CancellationFee )
    | ( CarrierModel )
    | ( Omit<CarrierAccessorial, 'carrier'> & { carrier: _RefType['Carrier'] } )
    | ( Omit<CarrierRate, 'carrier'> & { carrier: _RefType['Carrier'] } )
    | ( ComplianceIssue )
    | ( Omit<ComplianceStatus, 'carrier'> & { carrier: _RefType['Carrier'] } )
    | ( DriverModel )
    | ( FreightModel )
    | ( FreightOwnerModel )
    | ( Omit<MaintenanceRecord, 'vehicle'> & { vehicle: _RefType['Vehicle'] } )
    | ( PenaltyPayment )
    | ( Omit<Review, 'carrier'> & { carrier: _RefType['Carrier'] } )
    | ( ShipmentModel )
    | ( Omit<ShipmentBid, 'carrier' | 'shipment'> & { carrier: _RefType['Carrier'], shipment: _RefType['Shipment'] } )
    | ( Omit<ShipmentDocument, 'shipment'> & { shipment: _RefType['Shipment'] } )
    | ( Omit<ShipmentEvent, 'shipment'> & { shipment: _RefType['Shipment'] } )
    | ( Omit<ShipmentFreight, 'freight' | 'shipment'> & { freight: _RefType['Freight'], shipment: _RefType['Shipment'] } )
    | ( Omit<ShipmentLog, 'shipment'> & { shipment: _RefType['Shipment'] } )
    | ( Omit<ShipmentStop, 'shipment' | 'warehouse'> & { shipment: _RefType['Shipment'], warehouse: Maybe<_RefType['Warehouse']> } )
    | ( UserModel )
    | ( Omit<Vehicle, 'carrier' | 'currentDriver'> & { carrier: _RefType['Carrier'], currentDriver: Maybe<_RefType['Driver']> } )
    | ( WarehouseModel )
  ;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuditFilterInput: AuditFilterInput;
  AuditLogConnection: ResolverTypeWrapper<Omit<AuditLogConnection, 'items'> & { items: Array<ResolversTypes['ShipmentLog']> }>;
  AuditTrailConnection: ResolverTypeWrapper<Omit<AuditTrailConnection, 'items'> & { items: Array<ResolversTypes['ShipmentEvent']> }>;
  BidAcceptedEvent: ResolverTypeWrapper<BidAcceptedEvent>;
  BidConnection: ResolverTypeWrapper<Omit<BidConnection, 'items'> & { items: Array<ResolversTypes['ShipmentBid']> }>;
  BidInput: BidInput;
  BidReceivedEvent: ResolverTypeWrapper<Omit<BidReceivedEvent, 'bid'> & { bid: ResolversTypes['ShipmentBid'] }>;
  BidRequirement: ResolverTypeWrapper<BidRequirementModel>;
  BidRule: ResolverTypeWrapper<BidRuleModel>;
  BidRuleInput: BidRuleInput;
  BidStatus: BidStatus;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Broker: ResolverTypeWrapper<BrokerModel>;
  BrokerCarrierContract: ResolverTypeWrapper<Omit<BrokerCarrierContract, 'broker' | 'carrier' | 'rates'> & { broker: ResolversTypes['Broker'], carrier: ResolversTypes['Carrier'], rates: Array<ResolversTypes['BrokerRate']> }>;
  BrokerCarrierContractConnection: ResolverTypeWrapper<Omit<BrokerCarrierContractConnection, 'items'> & { items: Array<ResolversTypes['BrokerCarrierContract']> }>;
  BrokerConnection: ResolverTypeWrapper<Omit<BrokerConnection, 'items'> & { items: Array<ResolversTypes['Broker']> }>;
  BrokerRate: ResolverTypeWrapper<Omit<BrokerRate, 'contract'> & { contract: ResolversTypes['BrokerCarrierContract'] }>;
  BrokerRateConnection: ResolverTypeWrapper<Omit<BrokerRateConnection, 'items'> & { items: Array<ResolversTypes['BrokerRate']> }>;
  CancellationFee: ResolverTypeWrapper<CancellationFee>;
  CancellationFeeConnection: ResolverTypeWrapper<CancellationFeeConnection>;
  Carrier: ResolverTypeWrapper<CarrierModel>;
  CarrierAccessorial: ResolverTypeWrapper<Omit<CarrierAccessorial, 'carrier'> & { carrier: ResolversTypes['Carrier'] }>;
  CarrierAccessorialConnection: ResolverTypeWrapper<Omit<CarrierAccessorialConnection, 'items'> & { items: Array<ResolversTypes['CarrierAccessorial']> }>;
  CarrierAuthorityType: CarrierAuthorityType;
  CarrierConnection: ResolverTypeWrapper<Omit<CarrierConnection, 'items'> & { items: Array<ResolversTypes['Carrier']> }>;
  CarrierRate: ResolverTypeWrapper<Omit<CarrierRate, 'carrier'> & { carrier: ResolversTypes['Carrier'] }>;
  CarrierRateConnection: ResolverTypeWrapper<Omit<CarrierRateConnection, 'items'> & { items: Array<ResolversTypes['CarrierRate']> }>;
  CarrierRating: ResolverTypeWrapper<CarrierRating>;
  ComplianceFilterInput: ComplianceFilterInput;
  ComplianceIssue: ResolverTypeWrapper<ComplianceIssue>;
  ComplianceIssueConnection: ResolverTypeWrapper<ComplianceIssueConnection>;
  ComplianceStatus: ResolverTypeWrapper<Omit<ComplianceStatus, 'carrier'> & { carrier: ResolversTypes['Carrier'] }>;
  CreateBrokerCarrierContractInput: CreateBrokerCarrierContractInput;
  CreateBrokerInput: CreateBrokerInput;
  CreateBrokerRateInput: CreateBrokerRateInput;
  CreateCarrierAccessorialInput: CreateCarrierAccessorialInput;
  CreateCarrierInput: CreateCarrierInput;
  CreateCarrierRateInput: CreateCarrierRateInput;
  CreateDriverInput: CreateDriverInput;
  CreateFreightInput: CreateFreightInput;
  CreateFreightOwnerInput: CreateFreightOwnerInput;
  CreateShipmentDocumentInput: CreateShipmentDocumentInput;
  CreateShipmentEventInput: CreateShipmentEventInput;
  CreateShipmentFreightInput: CreateShipmentFreightInput;
  CreateShipmentInput: CreateShipmentInput;
  CreateShipmentLogInput: CreateShipmentLogInput;
  CreateShipmentStopInput: CreateShipmentStopInput;
  CreateVehicleInput: CreateVehicleInput;
  CreateWarehouseInput: CreateWarehouseInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Driver: ResolverTypeWrapper<DriverModel>;
  DriverConnection: ResolverTypeWrapper<Omit<DriverConnection, 'items'> & { items: Array<ResolversTypes['Driver']> }>;
  DriverStatus: DriverStatus;
  Error: ResolverTypeWrapper<Error>;
  EventType: EventType;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Freight: ResolverTypeWrapper<FreightModel>;
  FreightConnection: ResolverTypeWrapper<Omit<FreightConnection, 'items'> & { items: Array<ResolversTypes['Freight']> }>;
  FreightOwner: ResolverTypeWrapper<FreightOwnerModel>;
  FreightOwnerConnection: ResolverTypeWrapper<Omit<FreightOwnerConnection, 'items'> & { items: Array<ResolversTypes['FreightOwner']> }>;
  FreightStatus: FreightStatus;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  MaintenanceConnection: ResolverTypeWrapper<Omit<MaintenanceConnection, 'items'> & { items: Array<ResolversTypes['MaintenanceRecord']> }>;
  MaintenanceInput: MaintenanceInput;
  MaintenanceRecord: ResolverTypeWrapper<Omit<MaintenanceRecord, 'vehicle'> & { vehicle: ResolversTypes['Vehicle'] }>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationInput: PaginationInput;
  PenaltyFilterInput: PenaltyFilterInput;
  PenaltyPayment: ResolverTypeWrapper<PenaltyPayment>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Review: ResolverTypeWrapper<Omit<Review, 'carrier'> & { carrier: ResolversTypes['Carrier'] }>;
  ReviewConnection: ResolverTypeWrapper<Omit<ReviewConnection, 'items'> & { items: Array<ResolversTypes['Review']> }>;
  ReviewInput: ReviewInput;
  RuleType: RuleType;
  Shipment: ResolverTypeWrapper<ShipmentModel>;
  ShipmentBid: ResolverTypeWrapper<Omit<ShipmentBid, 'carrier' | 'shipment'> & { carrier: ResolversTypes['Carrier'], shipment: ResolversTypes['Shipment'] }>;
  ShipmentConnection: ResolverTypeWrapper<Omit<ShipmentConnection, 'items'> & { items: Array<ResolversTypes['Shipment']> }>;
  ShipmentDocument: ResolverTypeWrapper<Omit<ShipmentDocument, 'shipment'> & { shipment: ResolversTypes['Shipment'] }>;
  ShipmentDocumentConnection: ResolverTypeWrapper<Omit<ShipmentDocumentConnection, 'items'> & { items: Array<ResolversTypes['ShipmentDocument']> }>;
  ShipmentEvent: ResolverTypeWrapper<Omit<ShipmentEvent, 'shipment'> & { shipment: ResolversTypes['Shipment'] }>;
  ShipmentEventConnection: ResolverTypeWrapper<Omit<ShipmentEventConnection, 'items'> & { items: Array<ResolversTypes['ShipmentEvent']> }>;
  ShipmentFreight: ResolverTypeWrapper<Omit<ShipmentFreight, 'freight' | 'shipment'> & { freight: ResolversTypes['Freight'], shipment: ResolversTypes['Shipment'] }>;
  ShipmentFreightConnection: ResolverTypeWrapper<Omit<ShipmentFreightConnection, 'items'> & { items: Array<ResolversTypes['ShipmentFreight']> }>;
  ShipmentLog: ResolverTypeWrapper<Omit<ShipmentLog, 'shipment'> & { shipment: ResolversTypes['Shipment'] }>;
  ShipmentLogConnection: ResolverTypeWrapper<Omit<ShipmentLogConnection, 'items'> & { items: Array<ResolversTypes['ShipmentLog']> }>;
  ShipmentStatus: ShipmentStatus;
  ShipmentStatusEvent: ResolverTypeWrapper<ShipmentStatusEvent>;
  ShipmentStop: ResolverTypeWrapper<Omit<ShipmentStop, 'shipment' | 'warehouse'> & { shipment: ResolversTypes['Shipment'], warehouse: Maybe<ResolversTypes['Warehouse']> }>;
  ShipmentStopConnection: ResolverTypeWrapper<Omit<ShipmentStopConnection, 'items'> & { items: Array<ResolversTypes['ShipmentStop']> }>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  TruckStatus: TruckStatus;
  UpdateBrokerCarrierContractInput: UpdateBrokerCarrierContractInput;
  UpdateBrokerRateInput: UpdateBrokerRateInput;
  UpdateCarrierAccessorialInput: UpdateCarrierAccessorialInput;
  UpdateCarrierRateInput: UpdateCarrierRateInput;
  UpdateFreightInput: UpdateFreightInput;
  UpdateShipmentDocumentInput: UpdateShipmentDocumentInput;
  UpdateShipmentFreightInput: UpdateShipmentFreightInput;
  UpdateShipmentInput: UpdateShipmentInput;
  UpdateShipmentStopInput: UpdateShipmentStopInput;
  UpdateVehicleInput: UpdateVehicleInput;
  UpdateWarehouseInput: UpdateWarehouseInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<UserModel>;
  UserRole: UserRole;
  UserStatus: UserStatus;
  UsersInput: UsersInput;
  UsersResult: ResolverTypeWrapper<Omit<UsersResult, 'users'> & { users: Array<ResolversTypes['User']> }>;
  Vehicle: ResolverTypeWrapper<Omit<Vehicle, 'carrier' | 'currentDriver'> & { carrier: ResolversTypes['Carrier'], currentDriver: Maybe<ResolversTypes['Driver']> }>;
  VehicleConnection: ResolverTypeWrapper<Omit<VehicleConnection, 'items'> & { items: Array<ResolversTypes['Vehicle']> }>;
  VerificationStatus: VerificationStatus;
  Warehouse: ResolverTypeWrapper<WarehouseModel>;
  WarehouseConnection: ResolverTypeWrapper<Omit<WarehouseConnection, 'items'> & { items: Array<ResolversTypes['Warehouse']> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuditFilterInput: AuditFilterInput;
  AuditLogConnection: Omit<AuditLogConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentLog']> };
  AuditTrailConnection: Omit<AuditTrailConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentEvent']> };
  BidAcceptedEvent: BidAcceptedEvent;
  BidConnection: Omit<BidConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentBid']> };
  BidInput: BidInput;
  BidReceivedEvent: Omit<BidReceivedEvent, 'bid'> & { bid: ResolversParentTypes['ShipmentBid'] };
  BidRequirement: BidRequirementModel;
  BidRule: BidRuleModel;
  BidRuleInput: BidRuleInput;
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  Broker: BrokerModel;
  BrokerCarrierContract: Omit<BrokerCarrierContract, 'broker' | 'carrier' | 'rates'> & { broker: ResolversParentTypes['Broker'], carrier: ResolversParentTypes['Carrier'], rates: Array<ResolversParentTypes['BrokerRate']> };
  BrokerCarrierContractConnection: Omit<BrokerCarrierContractConnection, 'items'> & { items: Array<ResolversParentTypes['BrokerCarrierContract']> };
  BrokerConnection: Omit<BrokerConnection, 'items'> & { items: Array<ResolversParentTypes['Broker']> };
  BrokerRate: Omit<BrokerRate, 'contract'> & { contract: ResolversParentTypes['BrokerCarrierContract'] };
  BrokerRateConnection: Omit<BrokerRateConnection, 'items'> & { items: Array<ResolversParentTypes['BrokerRate']> };
  CancellationFee: CancellationFee;
  CancellationFeeConnection: CancellationFeeConnection;
  Carrier: CarrierModel;
  CarrierAccessorial: Omit<CarrierAccessorial, 'carrier'> & { carrier: ResolversParentTypes['Carrier'] };
  CarrierAccessorialConnection: Omit<CarrierAccessorialConnection, 'items'> & { items: Array<ResolversParentTypes['CarrierAccessorial']> };
  CarrierConnection: Omit<CarrierConnection, 'items'> & { items: Array<ResolversParentTypes['Carrier']> };
  CarrierRate: Omit<CarrierRate, 'carrier'> & { carrier: ResolversParentTypes['Carrier'] };
  CarrierRateConnection: Omit<CarrierRateConnection, 'items'> & { items: Array<ResolversParentTypes['CarrierRate']> };
  CarrierRating: CarrierRating;
  ComplianceFilterInput: ComplianceFilterInput;
  ComplianceIssue: ComplianceIssue;
  ComplianceIssueConnection: ComplianceIssueConnection;
  ComplianceStatus: Omit<ComplianceStatus, 'carrier'> & { carrier: ResolversParentTypes['Carrier'] };
  CreateBrokerCarrierContractInput: CreateBrokerCarrierContractInput;
  CreateBrokerInput: CreateBrokerInput;
  CreateBrokerRateInput: CreateBrokerRateInput;
  CreateCarrierAccessorialInput: CreateCarrierAccessorialInput;
  CreateCarrierInput: CreateCarrierInput;
  CreateCarrierRateInput: CreateCarrierRateInput;
  CreateDriverInput: CreateDriverInput;
  CreateFreightInput: CreateFreightInput;
  CreateFreightOwnerInput: CreateFreightOwnerInput;
  CreateShipmentDocumentInput: CreateShipmentDocumentInput;
  CreateShipmentEventInput: CreateShipmentEventInput;
  CreateShipmentFreightInput: CreateShipmentFreightInput;
  CreateShipmentInput: CreateShipmentInput;
  CreateShipmentLogInput: CreateShipmentLogInput;
  CreateShipmentStopInput: CreateShipmentStopInput;
  CreateVehicleInput: CreateVehicleInput;
  CreateWarehouseInput: CreateWarehouseInput;
  DateTime: Scalars['DateTime']['output'];
  Driver: DriverModel;
  DriverConnection: Omit<DriverConnection, 'items'> & { items: Array<ResolversParentTypes['Driver']> };
  Error: Error;
  Float: Scalars['Float']['output'];
  Freight: FreightModel;
  FreightConnection: Omit<FreightConnection, 'items'> & { items: Array<ResolversParentTypes['Freight']> };
  FreightOwner: FreightOwnerModel;
  FreightOwnerConnection: Omit<FreightOwnerConnection, 'items'> & { items: Array<ResolversParentTypes['FreightOwner']> };
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  MaintenanceConnection: Omit<MaintenanceConnection, 'items'> & { items: Array<ResolversParentTypes['MaintenanceRecord']> };
  MaintenanceInput: MaintenanceInput;
  MaintenanceRecord: Omit<MaintenanceRecord, 'vehicle'> & { vehicle: ResolversParentTypes['Vehicle'] };
  Mutation: Record<PropertyKey, never>;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  PageInfo: PageInfo;
  PaginationInput: PaginationInput;
  PenaltyFilterInput: PenaltyFilterInput;
  PenaltyPayment: PenaltyPayment;
  Query: Record<PropertyKey, never>;
  Review: Omit<Review, 'carrier'> & { carrier: ResolversParentTypes['Carrier'] };
  ReviewConnection: Omit<ReviewConnection, 'items'> & { items: Array<ResolversParentTypes['Review']> };
  ReviewInput: ReviewInput;
  Shipment: ShipmentModel;
  ShipmentBid: Omit<ShipmentBid, 'carrier' | 'shipment'> & { carrier: ResolversParentTypes['Carrier'], shipment: ResolversParentTypes['Shipment'] };
  ShipmentConnection: Omit<ShipmentConnection, 'items'> & { items: Array<ResolversParentTypes['Shipment']> };
  ShipmentDocument: Omit<ShipmentDocument, 'shipment'> & { shipment: ResolversParentTypes['Shipment'] };
  ShipmentDocumentConnection: Omit<ShipmentDocumentConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentDocument']> };
  ShipmentEvent: Omit<ShipmentEvent, 'shipment'> & { shipment: ResolversParentTypes['Shipment'] };
  ShipmentEventConnection: Omit<ShipmentEventConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentEvent']> };
  ShipmentFreight: Omit<ShipmentFreight, 'freight' | 'shipment'> & { freight: ResolversParentTypes['Freight'], shipment: ResolversParentTypes['Shipment'] };
  ShipmentFreightConnection: Omit<ShipmentFreightConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentFreight']> };
  ShipmentLog: Omit<ShipmentLog, 'shipment'> & { shipment: ResolversParentTypes['Shipment'] };
  ShipmentLogConnection: Omit<ShipmentLogConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentLog']> };
  ShipmentStatusEvent: ShipmentStatusEvent;
  ShipmentStop: Omit<ShipmentStop, 'shipment' | 'warehouse'> & { shipment: ResolversParentTypes['Shipment'], warehouse: Maybe<ResolversParentTypes['Warehouse']> };
  ShipmentStopConnection: Omit<ShipmentStopConnection, 'items'> & { items: Array<ResolversParentTypes['ShipmentStop']> };
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
  UpdateBrokerCarrierContractInput: UpdateBrokerCarrierContractInput;
  UpdateBrokerRateInput: UpdateBrokerRateInput;
  UpdateCarrierAccessorialInput: UpdateCarrierAccessorialInput;
  UpdateCarrierRateInput: UpdateCarrierRateInput;
  UpdateFreightInput: UpdateFreightInput;
  UpdateShipmentDocumentInput: UpdateShipmentDocumentInput;
  UpdateShipmentFreightInput: UpdateShipmentFreightInput;
  UpdateShipmentInput: UpdateShipmentInput;
  UpdateShipmentStopInput: UpdateShipmentStopInput;
  UpdateVehicleInput: UpdateVehicleInput;
  UpdateWarehouseInput: UpdateWarehouseInput;
  Upload: Scalars['Upload']['output'];
  User: UserModel;
  UsersInput: UsersInput;
  UsersResult: Omit<UsersResult, 'users'> & { users: Array<ResolversParentTypes['User']> };
  Vehicle: Omit<Vehicle, 'carrier' | 'currentDriver'> & { carrier: ResolversParentTypes['Carrier'], currentDriver: Maybe<ResolversParentTypes['Driver']> };
  VehicleConnection: Omit<VehicleConnection, 'items'> & { items: Array<ResolversParentTypes['Vehicle']> };
  Warehouse: WarehouseModel;
  WarehouseConnection: Omit<WarehouseConnection, 'items'> & { items: Array<ResolversParentTypes['Warehouse']> };
};

export type AuditLogConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuditLogConnection'] = ResolversParentTypes['AuditLogConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentLog']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type AuditTrailConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuditTrailConnection'] = ResolversParentTypes['AuditTrailConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentEvent']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type BidAcceptedEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BidAcceptedEvent'] = ResolversParentTypes['BidAcceptedEvent']> = {
  bidId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shipmentId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type BidConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BidConnection'] = ResolversParentTypes['BidConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentBid']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type BidReceivedEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BidReceivedEvent'] = ResolversParentTypes['BidReceivedEvent']> = {
  bid: Resolver<ResolversTypes['ShipmentBid'], ParentType, ContextType>;
  shipmentId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type BidRequirementResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BidRequirement'] = ResolversParentTypes['BidRequirement']> = {
  bidId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  passed: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ruleId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BidRuleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BidRule'] = ResolversParentTypes['BidRule']> = {
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  enforced: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  requirementValue: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ruleType: Resolver<ResolversTypes['RuleType'], ParentType, ContextType>;
  shipmentId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BrokerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Broker'] = ResolversParentTypes['Broker']> = {
  address: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  city: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companyName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  phone: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shipments: Resolver<Array<ResolversTypes['Shipment']>, ParentType, ContextType>;
  state: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalShipments: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verificationStatus: Resolver<ResolversTypes['VerificationStatus'], ParentType, ContextType>;
  zipCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BrokerCarrierContractResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BrokerCarrierContract'] = ResolversParentTypes['BrokerCarrierContract']> = {
  baselineFuel: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  broker: Resolver<ResolversTypes['Broker'], ParentType, ContextType>;
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  contractNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  defaultRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  endDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  fuelSurchargeFormula: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maxRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  minRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paymentTerms: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rates: Resolver<Array<ResolversTypes['BrokerRate']>, ParentType, ContextType>;
  startDate: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  termsDays: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  volumeDiscount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volumeThreshold: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BrokerCarrierContractConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BrokerCarrierContractConnection'] = ResolversParentTypes['BrokerCarrierContractConnection']> = {
  items: Resolver<Array<ResolversTypes['BrokerCarrierContract']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type BrokerConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BrokerConnection'] = ResolversParentTypes['BrokerConnection']> = {
  items: Resolver<Array<ResolversTypes['Broker']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type BrokerRateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BrokerRate'] = ResolversParentTypes['BrokerRate']> = {
  brokerRateId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contract: Resolver<ResolversTypes['BrokerCarrierContract'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  destCity: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destState: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  effectiveDate: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expiryDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  freightClassMax: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  freightClassMin: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  laneDescription: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  minimumCharge: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  originCity: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originState: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  weightMax: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weightMin: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BrokerRateConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BrokerRateConnection'] = ResolversParentTypes['BrokerRateConnection']> = {
  items: Resolver<Array<ResolversTypes['BrokerRate']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type CancellationFeeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CancellationFee'] = ResolversParentTypes['CancellationFee']> = {
  calculatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  distributedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  feePercentage: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paidBidderIds: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  shipmentId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  totalFeeAmount: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CancellationFeeConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CancellationFeeConnection'] = ResolversParentTypes['CancellationFeeConnection']> = {
  items: Resolver<Array<ResolversTypes['CancellationFee']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type CarrierResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Carrier'] = ResolversParentTypes['Carrier']> = {
  address: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  averageFleetAge: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cargoInsurance: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  city: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companyName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  damageRate: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  dotNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  drivers: Resolver<Array<ResolversTypes['Driver']>, ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fleetTypes: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  insuranceExpiryDate: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  insurancePolicyId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  insuranceProvider: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  liabilityLimit: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  licenseExpiryDate: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  licenseNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mcNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  onTimeDelivery: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  operatingAuthority: Resolver<ResolversTypes['CarrierAuthorityType'], ParentType, ContextType>;
  phone: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  safetyScore: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shipments: Resolver<Array<ResolversTypes['Shipment']>, ParentType, ContextType>;
  specializations: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  state: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalDrivers: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalShipments: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTrucks: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trucks: Resolver<Array<ResolversTypes['Vehicle']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verificationStatus: Resolver<ResolversTypes['VerificationStatus'], ParentType, ContextType>;
  zipCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarrierAccessorialResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CarrierAccessorial'] = ResolversParentTypes['CarrierAccessorial']> = {
  availableRegions: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isApproved: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  minRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  serviceCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  serviceDescription: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  serviceName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  unitType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarrierAccessorialConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CarrierAccessorialConnection'] = ResolversParentTypes['CarrierAccessorialConnection']> = {
  items: Resolver<Array<ResolversTypes['CarrierAccessorial']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type CarrierConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CarrierConnection'] = ResolversParentTypes['CarrierConnection']> = {
  items: Resolver<Array<ResolversTypes['Carrier']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type CarrierRateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CarrierRate'] = ResolversParentTypes['CarrierRate']> = {
  baseRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  carrierRateId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  costPerMile: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deadheadCost: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  destCity: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  destState: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  effectiveDate: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expiryDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  freightClassMax: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  freightClassMin: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  laneDescription: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maxRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  minRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  originCity: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originState: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  weightMax: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weightMin: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CarrierRateConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CarrierRateConnection'] = ResolversParentTypes['CarrierRateConnection']> = {
  items: Resolver<Array<ResolversTypes['CarrierRate']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type CarrierRatingResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CarrierRating'] = ResolversParentTypes['CarrierRating']> = {
  averageRating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reviewCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ComplianceIssueResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ComplianceIssue'] = ResolversParentTypes['ComplianceIssue']> = {
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issueType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resolvedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  severity: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ComplianceIssueConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ComplianceIssueConnection'] = ResolversParentTypes['ComplianceIssueConnection']> = {
  items: Resolver<Array<ResolversTypes['ComplianceIssue']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ComplianceStatusResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ComplianceStatus'] = ResolversParentTypes['ComplianceStatus']> = {
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hazmatCertified: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hosCompliant: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  insuranceCurrent: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  temperatureControlEquipped: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vehicleAgeMet: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DriverResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Driver'] = ResolversParentTypes['Driver']> = {
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  licenseExpiryDate: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  licenseNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['DriverStatus'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DriverConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DriverConnection'] = ResolversParentTypes['DriverConnection']> = {
  items: Resolver<Array<ResolversTypes['Driver']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  code: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  extensions: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  message: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type FreightResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Freight'] = ResolversParentTypes['Freight']> = {
  broker: Resolver<Maybe<ResolversTypes['Broker']>, ParentType, ContextType>;
  brokerId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentWarehouse: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType>;
  currentWarehouseId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  declaredValue: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  freightNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hazmatClass: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hazmatDescription: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hazmatUNNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  hsCode: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFragile: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isHazmat: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPerishable: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isValueable: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  length: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  owner: Resolver<ResolversTypes['FreightOwner'], ParentType, ContextType>;
  ownerId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productDescription: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  productName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  requiresHandling: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  shipments: Resolver<Array<ResolversTypes['Shipment']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['FreightStatus'], ParentType, ContextType>;
  storageEndDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  storageStartDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  temperatureMax: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  temperatureMin: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalWeight: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitWeight: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  volume: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  width: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FreightConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FreightConnection'] = ResolversParentTypes['FreightConnection']> = {
  items: Resolver<Array<ResolversTypes['Freight']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type FreightOwnerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FreightOwner'] = ResolversParentTypes['FreightOwner']> = {
  address: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  city: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companyName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  freights: Resolver<Array<ResolversTypes['Freight']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  phone: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shipments: Resolver<Array<ResolversTypes['Shipment']>, ParentType, ContextType>;
  state: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalShipments: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verificationStatus: Resolver<ResolversTypes['VerificationStatus'], ParentType, ContextType>;
  zipCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FreightOwnerConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['FreightOwnerConnection'] = ResolversParentTypes['FreightOwnerConnection']> = {
  items: Resolver<Array<ResolversTypes['FreightOwner']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MaintenanceConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MaintenanceConnection'] = ResolversParentTypes['MaintenanceConnection']> = {
  items: Resolver<Array<ResolversTypes['MaintenanceRecord']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type MaintenanceRecordResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MaintenanceRecord'] = ResolversParentTypes['MaintenanceRecord']> = {
  completedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  cost: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  maintenanceType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextScheduledDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vehicle: Resolver<ResolversTypes['Vehicle'], ParentType, ContextType>;
  vehicleId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  acceptBid: Resolver<ResolversTypes['Shipment'], ParentType, ContextType, RequireFields<MutationAcceptBidArgs, 'bidId' | 'shipmentId'>>;
  archiveFreight: Resolver<ResolversTypes['Freight'], ParentType, ContextType, RequireFields<MutationArchiveFreightArgs, 'id'>>;
  cancelShipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType, RequireFields<MutationCancelShipmentArgs, 'reason' | 'shipmentId'>>;
  claimFreight: Resolver<ResolversTypes['Freight'], ParentType, ContextType, RequireFields<MutationClaimFreightArgs, 'brokerId' | 'id'>>;
  createBid: Resolver<ResolversTypes['ShipmentBid'], ParentType, ContextType, RequireFields<MutationCreateBidArgs, 'input' | 'shipmentId'>>;
  createBidRule: Resolver<ResolversTypes['BidRule'], ParentType, ContextType, RequireFields<MutationCreateBidRuleArgs, 'input' | 'shipmentId'>>;
  createBroker: Resolver<ResolversTypes['Broker'], ParentType, ContextType, RequireFields<MutationCreateBrokerArgs, 'input'>>;
  createBrokerCarrierContract: Resolver<ResolversTypes['BrokerCarrierContract'], ParentType, ContextType, RequireFields<MutationCreateBrokerCarrierContractArgs, 'input'>>;
  createBrokerRate: Resolver<ResolversTypes['BrokerRate'], ParentType, ContextType, RequireFields<MutationCreateBrokerRateArgs, 'input'>>;
  createCarrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType, RequireFields<MutationCreateCarrierArgs, 'input'>>;
  createCarrierAccessorial: Resolver<ResolversTypes['CarrierAccessorial'], ParentType, ContextType, RequireFields<MutationCreateCarrierAccessorialArgs, 'input'>>;
  createCarrierRate: Resolver<ResolversTypes['CarrierRate'], ParentType, ContextType, RequireFields<MutationCreateCarrierRateArgs, 'input'>>;
  createDriver: Resolver<ResolversTypes['Driver'], ParentType, ContextType, RequireFields<MutationCreateDriverArgs, 'input'>>;
  createFreight: Resolver<ResolversTypes['Freight'], ParentType, ContextType, RequireFields<MutationCreateFreightArgs, 'input'>>;
  createFreightOwner: Resolver<ResolversTypes['FreightOwner'], ParentType, ContextType, RequireFields<MutationCreateFreightOwnerArgs, 'input'>>;
  createMaintenanceRecord: Resolver<ResolversTypes['MaintenanceRecord'], ParentType, ContextType, RequireFields<MutationCreateMaintenanceRecordArgs, 'input' | 'vehicleId'>>;
  createReview: Resolver<ResolversTypes['Review'], ParentType, ContextType, RequireFields<MutationCreateReviewArgs, 'carrierId' | 'input'>>;
  createShipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType, RequireFields<MutationCreateShipmentArgs, 'input'>>;
  createShipmentDocument: Resolver<ResolversTypes['ShipmentDocument'], ParentType, ContextType, RequireFields<MutationCreateShipmentDocumentArgs, 'input'>>;
  createShipmentEvent: Resolver<ResolversTypes['ShipmentEvent'], ParentType, ContextType, RequireFields<MutationCreateShipmentEventArgs, 'input'>>;
  createShipmentFreight: Resolver<ResolversTypes['ShipmentFreight'], ParentType, ContextType, RequireFields<MutationCreateShipmentFreightArgs, 'input'>>;
  createShipmentLog: Resolver<ResolversTypes['ShipmentLog'], ParentType, ContextType, RequireFields<MutationCreateShipmentLogArgs, 'input'>>;
  createShipmentStop: Resolver<ResolversTypes['ShipmentStop'], ParentType, ContextType, RequireFields<MutationCreateShipmentStopArgs, 'input'>>;
  createVehicle: Resolver<ResolversTypes['Vehicle'], ParentType, ContextType, RequireFields<MutationCreateVehicleArgs, 'input'>>;
  createWarehouse: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationCreateWarehouseArgs, 'input'>>;
  deleteBidRule: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBidRuleArgs, 'id'>>;
  deleteVehicle: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteVehicleArgs, 'id'>>;
  openBidding: Resolver<ResolversTypes['Shipment'], ParentType, ContextType, RequireFields<MutationOpenBiddingArgs, 'brokerMarginPercent' | 'shipmentId'>>;
  overrideBidRuleCompliance: Resolver<ResolversTypes['ShipmentBid'], ParentType, ContextType, RequireFields<MutationOverrideBidRuleComplianceArgs, 'bidId' | 'reason'>>;
  rejectBid: Resolver<ResolversTypes['ShipmentBid'], ParentType, ContextType, RequireFields<MutationRejectBidArgs, 'id'>>;
  releaseFreightClaim: Resolver<ResolversTypes['Freight'], ParentType, ContextType, RequireFields<MutationReleaseFreightClaimArgs, 'id'>>;
  submitBid: Resolver<ResolversTypes['ShipmentBid'], ParentType, ContextType, RequireFields<MutationSubmitBidArgs, 'input' | 'rate' | 'shipmentId'>>;
  updateBid: Resolver<ResolversTypes['ShipmentBid'], ParentType, ContextType, RequireFields<MutationUpdateBidArgs, 'id' | 'input'>>;
  updateBidRule: Resolver<ResolversTypes['BidRule'], ParentType, ContextType, RequireFields<MutationUpdateBidRuleArgs, 'id' | 'input'>>;
  updateBroker: Resolver<ResolversTypes['Broker'], ParentType, ContextType, RequireFields<MutationUpdateBrokerArgs, 'id' | 'input'>>;
  updateBrokerCarrierContract: Resolver<ResolversTypes['BrokerCarrierContract'], ParentType, ContextType, RequireFields<MutationUpdateBrokerCarrierContractArgs, 'id' | 'input'>>;
  updateBrokerRate: Resolver<ResolversTypes['BrokerRate'], ParentType, ContextType, RequireFields<MutationUpdateBrokerRateArgs, 'id' | 'input'>>;
  updateCapacity: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationUpdateCapacityArgs, 'capacityKg' | 'id'>>;
  updateCarrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType, RequireFields<MutationUpdateCarrierArgs, 'id' | 'input'>>;
  updateCarrierAccessorial: Resolver<ResolversTypes['CarrierAccessorial'], ParentType, ContextType, RequireFields<MutationUpdateCarrierAccessorialArgs, 'id' | 'input'>>;
  updateCarrierRate: Resolver<ResolversTypes['CarrierRate'], ParentType, ContextType, RequireFields<MutationUpdateCarrierRateArgs, 'id' | 'input'>>;
  updateDriver: Resolver<ResolversTypes['Driver'], ParentType, ContextType, RequireFields<MutationUpdateDriverArgs, 'id' | 'input'>>;
  updateDriverStatus: Resolver<ResolversTypes['Driver'], ParentType, ContextType, RequireFields<MutationUpdateDriverStatusArgs, 'id' | 'status'>>;
  updateFreight: Resolver<ResolversTypes['Freight'], ParentType, ContextType, RequireFields<MutationUpdateFreightArgs, 'id' | 'input'>>;
  updateFreightOwner: Resolver<ResolversTypes['FreightOwner'], ParentType, ContextType, RequireFields<MutationUpdateFreightOwnerArgs, 'id' | 'input'>>;
  updateReview: Resolver<ResolversTypes['Review'], ParentType, ContextType, RequireFields<MutationUpdateReviewArgs, 'id' | 'input'>>;
  updateShipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType, RequireFields<MutationUpdateShipmentArgs, 'id' | 'input'>>;
  updateShipmentDocument: Resolver<ResolversTypes['ShipmentDocument'], ParentType, ContextType, RequireFields<MutationUpdateShipmentDocumentArgs, 'id' | 'input'>>;
  updateShipmentFreight: Resolver<ResolversTypes['ShipmentFreight'], ParentType, ContextType, RequireFields<MutationUpdateShipmentFreightArgs, 'id' | 'input'>>;
  updateShipmentStop: Resolver<ResolversTypes['ShipmentStop'], ParentType, ContextType, RequireFields<MutationUpdateShipmentStopArgs, 'id' | 'input'>>;
  updateVehicle: Resolver<ResolversTypes['Vehicle'], ParentType, ContextType, RequireFields<MutationUpdateVehicleArgs, 'id' | 'input'>>;
  updateVehicleStatus: Resolver<ResolversTypes['Vehicle'], ParentType, ContextType, RequireFields<MutationUpdateVehicleStatusArgs, 'id' | 'status'>>;
  updateWarehouse: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationUpdateWarehouseArgs, 'id' | 'input'>>;
};

export type NodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'BidRequirement' | 'BidRule' | 'Broker' | 'BrokerCarrierContract' | 'BrokerRate' | 'CancellationFee' | 'Carrier' | 'CarrierAccessorial' | 'CarrierRate' | 'ComplianceIssue' | 'ComplianceStatus' | 'Driver' | 'Freight' | 'FreightOwner' | 'MaintenanceRecord' | 'PenaltyPayment' | 'Review' | 'Shipment' | 'ShipmentBid' | 'ShipmentDocument' | 'ShipmentEvent' | 'ShipmentFreight' | 'ShipmentLog' | 'ShipmentStop' | 'User' | 'Vehicle' | 'Warehouse', ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasMore: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  limit: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  offset: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type PenaltyPaymentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PenaltyPayment'] = ResolversParentTypes['PenaltyPayment']> = {
  amount: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  bidId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getAuditLog: Resolver<Maybe<ResolversTypes['ShipmentLog']>, ParentType, ContextType, RequireFields<QueryGetAuditLogArgs, 'id'>>;
  getBid: Resolver<Maybe<ResolversTypes['ShipmentBid']>, ParentType, ContextType, RequireFields<QueryGetBidArgs, 'id'>>;
  getBidRules: Resolver<Array<ResolversTypes['BidRule']>, ParentType, ContextType, RequireFields<QueryGetBidRulesArgs, 'shipmentId'>>;
  getBroker: Resolver<Maybe<ResolversTypes['Broker']>, ParentType, ContextType, RequireFields<QueryGetBrokerArgs, 'id'>>;
  getBrokerCarrierContract: Resolver<Maybe<ResolversTypes['BrokerCarrierContract']>, ParentType, ContextType, RequireFields<QueryGetBrokerCarrierContractArgs, 'id'>>;
  getBrokerRate: Resolver<Maybe<ResolversTypes['BrokerRate']>, ParentType, ContextType, RequireFields<QueryGetBrokerRateArgs, 'id'>>;
  getCancellationFee: Resolver<Maybe<ResolversTypes['CancellationFee']>, ParentType, ContextType, RequireFields<QueryGetCancellationFeeArgs, 'shipmentId'>>;
  getCarrier: Resolver<Maybe<ResolversTypes['Carrier']>, ParentType, ContextType, RequireFields<QueryGetCarrierArgs, 'id'>>;
  getCarrierAccessorial: Resolver<Maybe<ResolversTypes['CarrierAccessorial']>, ParentType, ContextType, RequireFields<QueryGetCarrierAccessorialArgs, 'id'>>;
  getCarrierAverageRating: Resolver<ResolversTypes['CarrierRating'], ParentType, ContextType, RequireFields<QueryGetCarrierAverageRatingArgs, 'carrierId'>>;
  getCarrierRate: Resolver<Maybe<ResolversTypes['CarrierRate']>, ParentType, ContextType, RequireFields<QueryGetCarrierRateArgs, 'id'>>;
  getComplianceStatus: Resolver<Maybe<ResolversTypes['ComplianceStatus']>, ParentType, ContextType, RequireFields<QueryGetComplianceStatusArgs, 'carrierId'>>;
  getDriver: Resolver<Maybe<ResolversTypes['Driver']>, ParentType, ContextType, RequireFields<QueryGetDriverArgs, 'id'>>;
  getFreight: Resolver<Maybe<ResolversTypes['Freight']>, ParentType, ContextType, RequireFields<QueryGetFreightArgs, 'id'>>;
  getFreightAuditTrail: Resolver<ResolversTypes['AuditTrailConnection'], ParentType, ContextType, RequireFields<QueryGetFreightAuditTrailArgs, 'freightId' | 'input'>>;
  getFreightByNumber: Resolver<Maybe<ResolversTypes['Freight']>, ParentType, ContextType, RequireFields<QueryGetFreightByNumberArgs, 'number'>>;
  getFreightOwner: Resolver<Maybe<ResolversTypes['FreightOwner']>, ParentType, ContextType, RequireFields<QueryGetFreightOwnerArgs, 'id'>>;
  getMaintenanceRecord: Resolver<Maybe<ResolversTypes['MaintenanceRecord']>, ParentType, ContextType, RequireFields<QueryGetMaintenanceRecordArgs, 'id'>>;
  getPenaltyDistribution: Resolver<Array<ResolversTypes['PenaltyPayment']>, ParentType, ContextType, RequireFields<QueryGetPenaltyDistributionArgs, 'shipmentId'>>;
  getReview: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<QueryGetReviewArgs, 'id'>>;
  getShipment: Resolver<Maybe<ResolversTypes['Shipment']>, ParentType, ContextType, RequireFields<QueryGetShipmentArgs, 'id'>>;
  getShipmentAuditTrail: Resolver<ResolversTypes['AuditTrailConnection'], ParentType, ContextType, RequireFields<QueryGetShipmentAuditTrailArgs, 'input' | 'shipmentId'>>;
  getShipmentByNumber: Resolver<Maybe<ResolversTypes['Shipment']>, ParentType, ContextType, RequireFields<QueryGetShipmentByNumberArgs, 'number'>>;
  getShipmentDocument: Resolver<Maybe<ResolversTypes['ShipmentDocument']>, ParentType, ContextType, RequireFields<QueryGetShipmentDocumentArgs, 'id'>>;
  getShipmentEvent: Resolver<Maybe<ResolversTypes['ShipmentEvent']>, ParentType, ContextType, RequireFields<QueryGetShipmentEventArgs, 'id'>>;
  getShipmentFreight: Resolver<Maybe<ResolversTypes['ShipmentFreight']>, ParentType, ContextType, RequireFields<QueryGetShipmentFreightArgs, 'id'>>;
  getShipmentLog: Resolver<Maybe<ResolversTypes['ShipmentLog']>, ParentType, ContextType, RequireFields<QueryGetShipmentLogArgs, 'id'>>;
  getShipmentStop: Resolver<Maybe<ResolversTypes['ShipmentStop']>, ParentType, ContextType, RequireFields<QueryGetShipmentStopArgs, 'id'>>;
  getVehicle: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType, RequireFields<QueryGetVehicleArgs, 'id'>>;
  getWarehouse: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType, RequireFields<QueryGetWarehouseArgs, 'id'>>;
  listAuditLogs: Resolver<ResolversTypes['AuditLogConnection'], ParentType, ContextType, RequireFields<QueryListAuditLogsArgs, 'input'>>;
  listAvailableFreights: Resolver<ResolversTypes['FreightConnection'], ParentType, ContextType, RequireFields<QueryListAvailableFreightsArgs, 'input'>>;
  listBids: Resolver<ResolversTypes['BidConnection'], ParentType, ContextType, RequireFields<QueryListBidsArgs, 'input'>>;
  listBidsForCarrier: Resolver<ResolversTypes['BidConnection'], ParentType, ContextType, RequireFields<QueryListBidsForCarrierArgs, 'carrierId' | 'input'>>;
  listBidsForShipment: Resolver<ResolversTypes['BidConnection'], ParentType, ContextType, RequireFields<QueryListBidsForShipmentArgs, 'input' | 'shipmentId'>>;
  listBrokerCarrierContracts: Resolver<ResolversTypes['BrokerCarrierContractConnection'], ParentType, ContextType, RequireFields<QueryListBrokerCarrierContractsArgs, 'input'>>;
  listBrokerRates: Resolver<ResolversTypes['BrokerRateConnection'], ParentType, ContextType, RequireFields<QueryListBrokerRatesArgs, 'contractId' | 'input'>>;
  listBrokers: Resolver<ResolversTypes['BrokerConnection'], ParentType, ContextType, RequireFields<QueryListBrokersArgs, 'input'>>;
  listCancellationFees: Resolver<ResolversTypes['CancellationFeeConnection'], ParentType, ContextType, RequireFields<QueryListCancellationFeesArgs, 'input'>>;
  listCarrierAccessorials: Resolver<ResolversTypes['CarrierAccessorialConnection'], ParentType, ContextType, RequireFields<QueryListCarrierAccessorialsArgs, 'carrierId' | 'input'>>;
  listCarrierRates: Resolver<ResolversTypes['CarrierRateConnection'], ParentType, ContextType, RequireFields<QueryListCarrierRatesArgs, 'carrierId' | 'input'>>;
  listCarriers: Resolver<ResolversTypes['CarrierConnection'], ParentType, ContextType, RequireFields<QueryListCarriersArgs, 'input'>>;
  listCarriersByRating: Resolver<ResolversTypes['CarrierConnection'], ParentType, ContextType, RequireFields<QueryListCarriersByRatingArgs, 'input' | 'minRating'>>;
  listComplianceIssues: Resolver<ResolversTypes['ComplianceIssueConnection'], ParentType, ContextType, RequireFields<QueryListComplianceIssuesArgs, 'input'>>;
  listDrivers: Resolver<ResolversTypes['DriverConnection'], ParentType, ContextType, RequireFields<QueryListDriversArgs, 'input'>>;
  listDriversByCarrier: Resolver<ResolversTypes['DriverConnection'], ParentType, ContextType, RequireFields<QueryListDriversByCarrierArgs, 'carrierId' | 'input'>>;
  listFreightOwners: Resolver<ResolversTypes['FreightOwnerConnection'], ParentType, ContextType, RequireFields<QueryListFreightOwnersArgs, 'input'>>;
  listFreights: Resolver<ResolversTypes['FreightConnection'], ParentType, ContextType, RequireFields<QueryListFreightsArgs, 'input'>>;
  listMaintenanceHistory: Resolver<ResolversTypes['MaintenanceConnection'], ParentType, ContextType, RequireFields<QueryListMaintenanceHistoryArgs, 'input' | 'vehicleId'>>;
  listReviews: Resolver<ResolversTypes['ReviewConnection'], ParentType, ContextType, RequireFields<QueryListReviewsArgs, 'input'>>;
  listReviewsForCarrier: Resolver<ResolversTypes['ReviewConnection'], ParentType, ContextType, RequireFields<QueryListReviewsForCarrierArgs, 'carrierId' | 'input'>>;
  listShipmentDocuments: Resolver<ResolversTypes['ShipmentDocumentConnection'], ParentType, ContextType, RequireFields<QueryListShipmentDocumentsArgs, 'input' | 'shipmentId'>>;
  listShipmentEvents: Resolver<ResolversTypes['ShipmentEventConnection'], ParentType, ContextType, RequireFields<QueryListShipmentEventsArgs, 'input' | 'shipmentId'>>;
  listShipmentFreights: Resolver<ResolversTypes['ShipmentFreightConnection'], ParentType, ContextType, RequireFields<QueryListShipmentFreightsArgs, 'input' | 'shipmentId'>>;
  listShipmentLogs: Resolver<ResolversTypes['ShipmentLogConnection'], ParentType, ContextType, RequireFields<QueryListShipmentLogsArgs, 'input' | 'shipmentId'>>;
  listShipmentStops: Resolver<ResolversTypes['ShipmentStopConnection'], ParentType, ContextType, RequireFields<QueryListShipmentStopsArgs, 'input' | 'shipmentId'>>;
  listShipments: Resolver<ResolversTypes['ShipmentConnection'], ParentType, ContextType, RequireFields<QueryListShipmentsArgs, 'input'>>;
  listShipmentsByBroker: Resolver<ResolversTypes['ShipmentConnection'], ParentType, ContextType, RequireFields<QueryListShipmentsByBrokerArgs, 'brokerId' | 'input'>>;
  listShipmentsByCarrier: Resolver<ResolversTypes['ShipmentConnection'], ParentType, ContextType, RequireFields<QueryListShipmentsByCarrierArgs, 'carrierId' | 'input'>>;
  listVehicles: Resolver<ResolversTypes['VehicleConnection'], ParentType, ContextType, RequireFields<QueryListVehiclesArgs, 'input'>>;
  listVehiclesByCarrier: Resolver<ResolversTypes['VehicleConnection'], ParentType, ContextType, RequireFields<QueryListVehiclesByCarrierArgs, 'carrierId' | 'input'>>;
  listWarehouses: Resolver<ResolversTypes['WarehouseConnection'], ParentType, ContextType, RequireFields<QueryListWarehousesArgs, 'input'>>;
  me: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  searchBrokers: Resolver<ResolversTypes['BrokerConnection'], ParentType, ContextType, RequireFields<QuerySearchBrokersArgs, 'input'>>;
  searchCarriers: Resolver<ResolversTypes['CarrierConnection'], ParentType, ContextType, RequireFields<QuerySearchCarriersArgs, 'input'>>;
  searchWarehouses: Resolver<ResolversTypes['WarehouseConnection'], ParentType, ContextType, RequireFields<QuerySearchWarehousesArgs, 'input'>>;
  users: Resolver<ResolversTypes['UsersResult'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'input'>>;
};

export type ReviewResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shippmentId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReviewConnection'] = ResolversParentTypes['ReviewConnection']> = {
  items: Resolver<Array<ResolversTypes['Review']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ShipmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Shipment'] = ResolversParentTypes['Shipment']> = {
  acceptedBidId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  actualCost: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  actualMargin: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  actualOD: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  actualRevenue: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  baseRate: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  biddingOpenUntil: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  biddingOpenedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  bids: Resolver<Array<ResolversTypes['ShipmentBid']>, ParentType, ContextType>;
  broker: Resolver<ResolversTypes['Broker'], ParentType, ContextType>;
  brokerId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  brokerMarginAmount: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  brokerMarginPercent: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  cancelledAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  carrier: Resolver<Maybe<ResolversTypes['Carrier']>, ParentType, ContextType>;
  carrierId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  carrierRate: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  confirmedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customerRate: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  deliveredAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deliveryActual: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deliveryScheduled: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  destinationWarehouse: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType>;
  destinationWarehouseId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  distance: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  driver: Resolver<Maybe<ResolversTypes['Driver']>, ParentType, ContextType>;
  driverId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  estimatedCost: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  estimatedMargin: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  estimatedOD: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  estimatedRevenue: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  events: Resolver<Array<ResolversTypes['ShipmentEvent']>, ParentType, ContextType>;
  freights: Resolver<Array<ResolversTypes['Freight']>, ParentType, ContextType>;
  fuelSurcharge: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  fuelSurchargeAmount: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketAdjustment: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  originWarehouse: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType>;
  originWarehouseId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner: Resolver<ResolversTypes['FreightOwner'], ParentType, ContextType>;
  ownerBudget: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  ownerId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pickedUpAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  pickupActual: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  pickupScheduled: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  poNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referenceNumbers: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  shipmentNumber: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialInstructions: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['ShipmentStatus'], ParentType, ContextType>;
  surchargeRate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  truck: Resolver<Maybe<ResolversTypes['Vehicle']>, ParentType, ContextType>;
  truckId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipmentBidResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentBid'] = ResolversParentTypes['ShipmentBid']> = {
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  estimatedDeliveryDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  insuranceAmount: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rate: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  remarks: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ruleComplianceStatus: Resolver<ResolversTypes['BidStatus'], ParentType, ContextType>;
  shipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType>;
  shipmentId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['BidStatus'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipmentConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentConnection'] = ResolversParentTypes['ShipmentConnection']> = {
  items: Resolver<Array<ResolversTypes['Shipment']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ShipmentDocumentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentDocument'] = ResolversParentTypes['ShipmentDocument']> = {
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  documentNumber: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  expiryDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  fileName: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileSize: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  fileUrl: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issueDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  shipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType>;
  uploadedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verified: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  verifiedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  verifiedBy: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipmentDocumentConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentDocumentConnection'] = ResolversParentTypes['ShipmentDocumentConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentDocument']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ShipmentEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentEvent'] = ResolversParentTypes['ShipmentEvent']> = {
  actionDate: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  actionTaken: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  eventCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eventDescription: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eventTime: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  requiresAction: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  severity: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipmentEventConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentEventConnection'] = ResolversParentTypes['ShipmentEventConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentEvent']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ShipmentFreightResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentFreight'] = ResolversParentTypes['ShipmentFreight']> = {
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deliveredAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  freight: Resolver<ResolversTypes['Freight'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pickedUpAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  sequenceNumber: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipmentFreightConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentFreightConnection'] = ResolversParentTypes['ShipmentFreightConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentFreight']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ShipmentLogResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentLog'] = ResolversParentTypes['ShipmentLog']> = {
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deviceId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  eventTime: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  eventType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fuelLevel: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  humidity: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  latitude: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  location: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  longitude: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  mileage: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType>;
  temperature: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipmentLogConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentLogConnection'] = ResolversParentTypes['ShipmentLogConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentLog']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ShipmentStatusEventResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentStatusEvent'] = ResolversParentTypes['ShipmentStatusEvent']> = {
  newStatus: Resolver<ResolversTypes['ShipmentStatus'], ParentType, ContextType>;
  oldStatus: Resolver<ResolversTypes['ShipmentStatus'], ParentType, ContextType>;
  shipmentId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ShipmentStopResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentStop'] = ResolversParentTypes['ShipmentStop']> = {
  address: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  arrivedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  departedAt: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  duration: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  latitude: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  notes: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sequenceNumber: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shipment: Resolver<ResolversTypes['Shipment'], ParentType, ContextType>;
  stopType: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  warehouse: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipmentStopConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ShipmentStopConnection'] = ResolversParentTypes['ShipmentStopConnection']> = {
  items: Resolver<Array<ResolversTypes['ShipmentStop']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _empty: SubscriptionResolver<Maybe<ResolversTypes['String']>, "_empty", ParentType, ContextType>;
  bidAccepted: SubscriptionResolver<ResolversTypes['BidAcceptedEvent'], "bidAccepted", ParentType, ContextType, RequireFields<SubscriptionBidAcceptedArgs, 'shipmentId'>>;
  bidReceived: SubscriptionResolver<ResolversTypes['BidReceivedEvent'], "bidReceived", ParentType, ContextType, RequireFields<SubscriptionBidReceivedArgs, 'shipmentId'>>;
  newBidReceived: SubscriptionResolver<ResolversTypes['ShipmentBid'], "newBidReceived", ParentType, ContextType, RequireFields<SubscriptionNewBidReceivedArgs, 'shipmentId'>>;
  shipmentStatusChanged: SubscriptionResolver<ResolversTypes['ShipmentStatusEvent'], "shipmentStatusChanged", ParentType, ContextType, RequireFields<SubscriptionShipmentStatusChangedArgs, 'shipmentId'>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType>;
  status: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['UsersResult'] = ResolversParentTypes['UsersResult']> = {
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  users: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type VehicleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Vehicle'] = ResolversParentTypes['Vehicle']> = {
  carrier: Resolver<ResolversTypes['Carrier'], ParentType, ContextType>;
  carrierId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentDriver: Resolver<Maybe<ResolversTypes['Driver']>, ParentType, ContextType>;
  driverId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  licensePlate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  make: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  model: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status: Resolver<ResolversTypes['TruckStatus'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  vin: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  year: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VehicleConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VehicleConnection'] = ResolversParentTypes['VehicleConnection']> = {
  items: Resolver<Array<ResolversTypes['Vehicle']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type WarehouseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Warehouse'] = ResolversParentTypes['Warehouse']> = {
  address: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  availableCapacityKg: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  capacityUtilization: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  city: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  reviewCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  state: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalCapacityKg: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalShipments: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  usedCapacityKg: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  verificationStatus: Resolver<ResolversTypes['VerificationStatus'], ParentType, ContextType>;
  zipCode: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WarehouseConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['WarehouseConnection'] = ResolversParentTypes['WarehouseConnection']> = {
  items: Resolver<Array<ResolversTypes['Warehouse']>, ParentType, ContextType>;
  pageInfo: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  AuditLogConnection: AuditLogConnectionResolvers<ContextType>;
  AuditTrailConnection: AuditTrailConnectionResolvers<ContextType>;
  BidAcceptedEvent: BidAcceptedEventResolvers<ContextType>;
  BidConnection: BidConnectionResolvers<ContextType>;
  BidReceivedEvent: BidReceivedEventResolvers<ContextType>;
  BidRequirement: BidRequirementResolvers<ContextType>;
  BidRule: BidRuleResolvers<ContextType>;
  BigInt: GraphQLScalarType;
  Broker: BrokerResolvers<ContextType>;
  BrokerCarrierContract: BrokerCarrierContractResolvers<ContextType>;
  BrokerCarrierContractConnection: BrokerCarrierContractConnectionResolvers<ContextType>;
  BrokerConnection: BrokerConnectionResolvers<ContextType>;
  BrokerRate: BrokerRateResolvers<ContextType>;
  BrokerRateConnection: BrokerRateConnectionResolvers<ContextType>;
  CancellationFee: CancellationFeeResolvers<ContextType>;
  CancellationFeeConnection: CancellationFeeConnectionResolvers<ContextType>;
  Carrier: CarrierResolvers<ContextType>;
  CarrierAccessorial: CarrierAccessorialResolvers<ContextType>;
  CarrierAccessorialConnection: CarrierAccessorialConnectionResolvers<ContextType>;
  CarrierConnection: CarrierConnectionResolvers<ContextType>;
  CarrierRate: CarrierRateResolvers<ContextType>;
  CarrierRateConnection: CarrierRateConnectionResolvers<ContextType>;
  CarrierRating: CarrierRatingResolvers<ContextType>;
  ComplianceIssue: ComplianceIssueResolvers<ContextType>;
  ComplianceIssueConnection: ComplianceIssueConnectionResolvers<ContextType>;
  ComplianceStatus: ComplianceStatusResolvers<ContextType>;
  DateTime: GraphQLScalarType;
  Driver: DriverResolvers<ContextType>;
  DriverConnection: DriverConnectionResolvers<ContextType>;
  Error: ErrorResolvers<ContextType>;
  Freight: FreightResolvers<ContextType>;
  FreightConnection: FreightConnectionResolvers<ContextType>;
  FreightOwner: FreightOwnerResolvers<ContextType>;
  FreightOwnerConnection: FreightOwnerConnectionResolvers<ContextType>;
  JSON: GraphQLScalarType;
  MaintenanceConnection: MaintenanceConnectionResolvers<ContextType>;
  MaintenanceRecord: MaintenanceRecordResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Node: NodeResolvers<ContextType>;
  PageInfo: PageInfoResolvers<ContextType>;
  PenaltyPayment: PenaltyPaymentResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Review: ReviewResolvers<ContextType>;
  ReviewConnection: ReviewConnectionResolvers<ContextType>;
  Shipment: ShipmentResolvers<ContextType>;
  ShipmentBid: ShipmentBidResolvers<ContextType>;
  ShipmentConnection: ShipmentConnectionResolvers<ContextType>;
  ShipmentDocument: ShipmentDocumentResolvers<ContextType>;
  ShipmentDocumentConnection: ShipmentDocumentConnectionResolvers<ContextType>;
  ShipmentEvent: ShipmentEventResolvers<ContextType>;
  ShipmentEventConnection: ShipmentEventConnectionResolvers<ContextType>;
  ShipmentFreight: ShipmentFreightResolvers<ContextType>;
  ShipmentFreightConnection: ShipmentFreightConnectionResolvers<ContextType>;
  ShipmentLog: ShipmentLogResolvers<ContextType>;
  ShipmentLogConnection: ShipmentLogConnectionResolvers<ContextType>;
  ShipmentStatusEvent: ShipmentStatusEventResolvers<ContextType>;
  ShipmentStop: ShipmentStopResolvers<ContextType>;
  ShipmentStopConnection: ShipmentStopConnectionResolvers<ContextType>;
  Subscription: SubscriptionResolvers<ContextType>;
  Upload: GraphQLScalarType;
  User: UserResolvers<ContextType>;
  UsersResult: UsersResultResolvers<ContextType>;
  Vehicle: VehicleResolvers<ContextType>;
  VehicleConnection: VehicleConnectionResolvers<ContextType>;
  Warehouse: WarehouseResolvers<ContextType>;
  WarehouseConnection: WarehouseConnectionResolvers<ContextType>;
};

