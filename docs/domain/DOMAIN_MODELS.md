# Domain Models & Business Rules

## Overview

The Gruzin platform coordinates freight transportation across 11 phases. This document defines:

- **Entities** - What data is stored
- **State Machines** - Valid state transitions
- **Business Rules** - Constraints and validations
- **Workflows** - How entities interact

---

## Phase 1: Freight Submission

### **Freight Entity**

**State Machine:**

```
DRAFT → AVAILABLE → CLAIMED → ASSIGNED → IN_TRANSIT → DELIVERED → ARCHIVED
  ↓                                                                      ↑
  └──────────────────────────── CANCELLED ─────────────────────────────┘
```

**States Defined:**

- `DRAFT` - Created, not published
- `AVAILABLE` - Published, waiting for claims
- `CLAIMED` - Claimed by carrier/broker, waiting for shipment creation
- `ASSIGNED` - Assigned to shipment with bid
- `IN_TRANSIT` - Transport in progress
- `DELIVERED` - Delivery complete
- `ARCHIVED` - Historical record
- `CANCELLED` - Cancelled at any point before delivery

**Prisma Model:**

```prisma
model Freight {
  id                String @id @default(cuid())
  freightNumber     String @unique
  status            String // DRAFT | AVAILABLE | CLAIMED | ASSIGNED | IN_TRANSIT | DELIVERED | ARCHIVED | CANCELLED
  freightOwnerId    String
  freightOwner      FreightOwner @relation(fields: [freightOwnerId], references: [id])
  brokerClaimed     Boolean @default(false)
  claimingEntityId   String? // CarrierId or BrokerId
  warehouseIdFrom   String?
  warehouseIdTo     String?
  pickupLocation    Location
  dropoffLocation   Location
  description       String
  shipments         ShipmentFreight[] // links to shipments
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

**Business Rules:**

| Rule                                | When                     | Validation                                 |
| ----------------------------------- | ------------------------ | ------------------------------------------ |
| Must have owner                     | On create                | `freightOwnerId` not null                  |
| Locations required                  | On publish (→ AVAILABLE) | `pickupLocation` and `dropoffLocation` set |
| Can claim if AVAILABLE              | Carrier/Broker action    | `status === AVAILABLE`                     |
| Can only claim once                 | Prevent re-claiming      | `brokerClaimed === false` check            |
| Moving freight to CLAIMED           | Claim action             | `status` must be AVAILABLE                 |
| Cannot edit after CLAIMED           | Immutability rule        | After claim, only status changes           |
| Can cancel anytime except DELIVERED | Cancellation rule        | `status !== DELIVERED`                     |
| Owner can reclaim                   | If NOT claimed           | `brokerClaimed === false` → owner can edit |

**Service Methods:**

```typescript
class FreightService extends BaseService {
  // Queries
  async getFreight(id: string): Promise<Freight>;
  async findByFreightNumber(number: string): Promise<Freight | null>;
  async listByOwner(ownerId: string, pagination): Promise<Freight[]>;
  async listAvailableFreights(pagination): Promise<Freight[]>;
  async searchFreights(filters): Promise<Freight[]>;

  // Mutations
  async createFreight(input: CreateFreightInput): Promise<Freight>;
  async updateFreight(id: string, input: UpdateFreightInput): Promise<Freight>;
  async publishFreight(id: string): Promise<Freight>; // DRAFT → AVAILABLE
  async claimFreight(id: string, carrierId: string): Promise<Freight>; // AVAILABLE → CLAIMED
  async releaseFreight(id: string): Promise<Freight>; // CLAIMED → AVAILABLE
  async archiveFreight(id: string): Promise<Freight>; // → ARCHIVED
  async cancelFreight(id: string, reason: string): Promise<Freight>; // → CANCELLED
}
```

---

## Phase 2-11: Shipment Coordination

### **Shipment Entity**

**State Machine:**

```
POSTED → BIDDING_OPEN → BIDS_RECEIVED → BID_SELECTED → IN_PLANNING → IN_TRANSIT → DELIVERED → ARCHIVED
           ↓
         CANCELLED (until DELIVERED)
```

**States Defined:**

- `POSTED` - Created by broker/carrier, awaiting bids
- `BIDDING_OPEN` - Actively accepting bids (Phase 4-5)
- `BIDS_RECEIVED` - Contains ≥1 bids, accepting more (Phase 4-5)
- `BID_SELECTED` - Winner chosen, contract negotiated (Phase 6)
- `IN_PLANNING` - Routes planned, stops validated (Phase 7-8)
- `IN_TRANSIT` - Vehicle en route (Phase 9-10)
- `DELIVERED` - All stops completed (Phase 11)
- `ARCHIVED` - Historical record
- `CANCELLED` - Cancelled (can happen 2-6)

**Prisma Model:**

```prisma
model Shipment {
  id                 String @id @default(cuid())
  shipmentNumber     String @unique
  status             String // POSTED | BIDDING_OPEN | BIDS_RECEIVED | BID_SELECTED | IN_PLANNING | IN_TRANSIT | DELIVERED | ARCHIVED | CANCELLED
  brokerId           String?
  broker             Broker? @relation(fields: [brokerId], references: [id])
  creatingCarrierId  String?
  creatingCarrier    Carrier? @relation(fields: [creatingCarrierId], references: [id])
  selectedBidId      String?
  selectedBid        ShipmentBid? @relation(fields: [selectedBidId], references: [id])
  freights           ShipmentFreight[]
  stops              ShipmentStop[]
  bids               ShipmentBid[]
  contractId         String?
  contract           BrokerCarrierContract? @relation(fields: [contractId], references: [id])
  events             ShipmentEvent[]
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

**Business Rules:**

| Rule                              | Phase | Validation                                       |
| --------------------------------- | ----- | ------------------------------------------------ |
| Posted by broker or carrier       | 2     | Creator must be broker or carrier                |
| Open bidding immediately or later | 4     | Can stay in POSTED or move to BIDDING_OPEN       |
| Accept ≥1 full terms + ≥1 partial | 4-5   | Bids must have `compliance === COMPLIANT` subset |
| Award when ready                  | 5-6   | Select ONE bid, move to BID_SELECTED             |
| Negotiate terms                   | 6     | Contract exchange before IN_PLANNING             |
| Plan routes                       | 7     | Create ShipmentStop records, validate            |
| Assign vehicle                    | 8     | Assign truck + driver                            |
| Begin transport                   | 9     | Move to IN_TRANSIT                               |
| Complete stops                    | 10-11 | Mark stops completed, move to DELIVERED          |
| Can cancel until delivery         | 2-10  | Cannot cancel in DELIVERED                       |
| Cannot modify after BID_SELECTED  | 6+    | Routes locked in                                 |

**Service Methods:**

```typescript
class ShipmentService extends BaseService {
  // Queries
  async getShipment(id: string): Promise<Shipment>;
  async findByNumber(number: string): Promise<Shipment | null>;
  async listCreatedByBroker(brokerId: string, filters): Promise<Shipment[]>;
  async listCreatedByCarrier(carrierId: string, filters): Promise<Shipment[]>;
  async listOpenForBidding(): Promise<Shipment[]>;
  async searchShipments(filters): Promise<Shipment[]>;

  // Mutations - Lifecycle
  async createShipment(input: CreateShipmentInput): Promise<Shipment>; // → POSTED
  async openBidding(shipmentId: string): Promise<Shipment>; // POSTED → BIDDING_OPEN
  async closeBidding(shipmentId: string): Promise<Shipment>; // BIDS_RECEIVED → BID_SELECTED (needs selectBid)
  async selectBid(shipmentId: string, bidId: string): Promise<Shipment>; // → BID_SELECTED
  async publishBid(shipmentId: string, bidId: string): Promise<Shipment>; // Notify carrier & broker
  async planRoutes(shipmentId: string, stops: StopInput[]): Promise<Shipment>; // → IN_PLANNING
  async assignVehicle(
    shipmentId: string,
    vehicleId: string,
    driverId: string,
  ): Promise<Shipment>;
  async startTransit(shipmentId: string): Promise<Shipment>; // → IN_TRANSIT
  async completeStop(
    shipmentId: string,
    stopId: string,
    proof: ProofInput,
  ): Promise<ShipmentStop>;
  async completeShipment(shipmentId: string): Promise<Shipment>; // → DELIVERED
  async cancelShipment(shipmentId: string, reason: string): Promise<Shipment>; // → CANCELLED
  async archiveShipment(shipmentId: string): Promise<Shipment>; // → ARCHIVED

  // Mutations - Rules & Compliance
  async validateBidCompliance(bidId: string): Promise<BidComplianceResult>;
  async createBidRule(input: CreateBidRuleInput): Promise<BidRule>;
  async updateBidRule(id: string, input: UpdateBidRuleInput): Promise<BidRule>;
}
```

### **ShipmentBid Entity**

**State Machine:**

```
PENDING → RULE_EVAL → RULE_COMPLIANT / NON_COMPLIANT → ACCEPTED / REJECTED / CANCELLED
↓                                                           ↑
└────────────────── WITHDRAWN ──────────────────────────────┘
```

**States:**

- `PENDING` - Bid submitted, awaiting rule evaluation
- `RULE_EVAL` - Evaluating against BidRule configs
- `RULE_COMPLIANT` - Passed all rules
- `NON_COMPLIANT` - Failed ≥1 rule
- `ACCEPTED` - Shipment selected this bid
- `REJECTED` - Shipment rejected
- `WITHDRAWN` - Bidder withdrew
- `CANCELLED` - Related shipment cancelled

**Prisma Model:**

```prisma
model ShipmentBid {
  id                  String @id @default(cuid())
  shipmentId          String
  shipment            Shipment @relation(fields: [shipmentId], references: [id])
  bidderId            String  // CarrierId or BrokerId
  bidderType          String  // CARRIER | BROKER
  compliance          String  // PENDING | RULE_EVAL | COMPLIANT | NON_COMPLIANT
  complianceReason    String?
  ruleChecks          BidRuleCheck[]
  fullTermsBid        Boolean // Is this full or partial terms?
  price               Decimal
  estimatedDays      Int
  termsAgreed        String[] // ['PAYMENT_30', 'NO_SUBCONTRACT']
  status              String  // ACCEPTED | REJECTED | WITHDRAWN | PENDING | CANCELLED
  createdAt           DateTime @default(now())
  respondedAt         DateTime?
  updatedAt           DateTime @updatedAt
}
```

**Business Rules:**

| Rule                                 | When            | Validation                                               |
| ------------------------------------ | --------------- | -------------------------------------------------------- |
| Bid only for open shipment           | On create       | `shipment.status === BIDDING_OPEN`                       |
| Check compliance on create           | Post-submission | Run all BidRule checks, set compliance                   |
| Can withdraw anytime except ACCEPTED | Withdrawal      | `status !== ACCEPTED`                                    |
| Award check driver license           | Before ACCEPTED | If CARRIER bid, all drivers must have valid licenses     |
| Price must be > 0                    | Validation      | `price > 0`                                              |
| Estimated days > 0                   | Validation      | `estimatedDays > 0`                                      |
| Cannot re-bid after rejection        | Rejection rule  | Same bidder cannot bid again on same shipment            |
| Only ONE accepted                    | Exclusivity     | Only one bid can have `status === ACCEPTED` per shipment |

**Service Methods:**

```typescript
class BiddingService extends BaseService {
  // Queries
  async getBid(bidId: string): Promise<ShipmentBid>;
  async listBidsForShipment(shipmentId: string): Promise<ShipmentBid[]>;
  async listBidsFromBidder(bidderId: string, filters): Promise<ShipmentBid[]>;
  async listCompliantBids(shipmentId: string): Promise<ShipmentBid[]>;

  // Mutations
  async submitBid(input: SubmitBidInput): Promise<ShipmentBid>; // → PENDING → RULE_EVAL → COMPLIANT/NON_COMPLIANT
  async evaluateBidCompliance(bidId: string): Promise<ShipmentBid>;
  async acceptBid(shipmentId: string, bidId: string): Promise<ShipmentBid>; // Selected shipment marks this accepted
  async rejectBid(bidId: string, reason: string): Promise<ShipmentBid>; // → REJECTED
  async withdrawBid(bidId: string): Promise<ShipmentBid>; // → WITHDRAWN
}
```

---

## Phase 3: Vehicle & Driver Management

### **Vehicle (Truck) Entity**

**State Machine:**

```
ACTIVE → MAINTENANCE → ACTIVE → ARCHIVED
  ↓
INACTIVE
```

**States:**

- `ACTIVE` - Available for shipping
- `MAINTENANCE` - Under maintenance, unavailable
- `INACTIVE` - Decommissioned
- `ARCHIVED` - Historical

**Prisma Model:**

```prisma
model Vehicle {
  id                  String @id @default(cuid())
  registrationNumber  String @unique
  status              String // ACTIVE | MAINTENANCE | INACTIVE | ARCHIVED
  carrierId           String
  carrier             Carrier @relation(fields: [carrierId], references: [id])
  type                String  // TRUCK | VAN | TANKER
  capacity            Float   // tons
  color               String
  lastInspectionDate  DateTime?
  nextInspectionDate  DateTime?
  inspections         TruckInspection[]
  maintenance         TruckMaintenance[]
  assignments         ShipmentVehicleAssignment[]
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

**Business Rules:**

| Rule                                 | When              | Validation                  |
| ------------------------------------ | ----------------- | --------------------------- |
| Assigned to exactly ONE carrier      | On create         | `carrierId` required        |
| Capacity must be > 0                 | Validation        | `capacity > 0`              |
| Cannot assign to INACTIVE            | During assignment | `status === ACTIVE`         |
| Can only move to MAINTENANCE if idle | On maintenance    | No active shipments         |
| Inspection required every 6 months   | Auto-warning      | Check `nextInspectionDate`  |
| Cannot use past inspection date      | Validation        | `inspectionDate <= today()` |

**Service Methods:**

```typescript
class VehicleService extends BaseService {
  // Queries
  async getVehicle(id: string): Promise<Vehicle>;
  async findByRegistration(reg: string): Promise<Vehicle | null>;
  async listByCarrier(carrierId: string, status?: string): Promise<Vehicle[]>;
  async listAvailable(): Promise<Vehicle[]>;

  // Mutations
  async createVehicle(input: CreateVehicleInput): Promise<Vehicle>;
  async updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle>;
  async moveToMaintenance(id: string, reason: string): Promise<Vehicle>;
  async returnFromMaintenance(
    id: string,
    inspectionId?: string,
  ): Promise<Vehicle>;
  async decommission(id: string): Promise<Vehicle>;
  async archive(id: string): Promise<Vehicle>;
}
```

### **Driver Entity**

**State Machine:**

```
ACTIVE → SUSPENDED → ACTIVE → INACTIVE → ARCHIVED
             ↑
           (appeal)
```

**States:**

- `ACTIVE` - Available to drive
- `SUSPENDED` - Temporarily unavailable (violations/incidents)
- `INACTIVE` - Not driving (on leave, terminated)
- `ARCHIVED` - Historical

**Prisma Model:**

```prisma
model Driver {
  id                      String @id @default(cuid())
  carrierId               String
  carrier                 Carrier @relation(fields: [carrierId], references: [id])
  status                  String  // ACTIVE | SUSPENDED | INACTIVE | ARCHIVED
  firstName               String
  lastName                String
  email                   String @unique
  phoneNumber             String
  driversLicenseNumber    String @unique
  licenseExpiryDate       DateTime
  employmentStatus        String  // EMPLOYED | CONTRACTOR
  violations              DriverViolation[]
  incidents               DriverIncident[]
  assignments             ShipmentVehicleAssignment[]
  avgRating               Float?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}
```

**Business Rules:**

| Rule                                 | When              | Validation                           |
| ------------------------------------ | ----------------- | ------------------------------------ |
| License must be valid                | Before assignment | `licenseExpiryDate > today()`        |
| License expiry warning               | Auto-check        | Warn at 30 days before expiry        |
| Cannot assign if SUSPENDED           | During assignment | `status === ACTIVE`                  |
| ≥3 violations = auto-suspend         | On 3rd violation  | Automatic status change              |
| Auto-remove suspension after 30 days | Auto-unsuspend    | If no new violations, move to ACTIVE |
| Cannot suspend INACTIVE              | Validation        | Only ACTIVE drivers can be suspended |
| Rating calculated from reviews       | Read-only         | Computed from Review model           |

**Service Methods:**

```typescript
class DriverService extends BaseService {
  // Queries
  async getDriver(id: string): Promise<Driver>;
  async listByCarrier(carrierId: string, status?: string): Promise<Driver[]>;
  async listAvailable(carrierId: string): Promise<Driver[]>;
  async getDriverViolations(driverId: string): Promise<DriverViolation[]>;
  async getDriverIncidents(driverId: string): Promise<DriverIncident[]>;

  // Mutations
  async createDriver(input: CreateDriverInput): Promise<Driver>;
  async updateDriver(id: string, input: UpdateDriverInput): Promise<Driver>;
  async recordViolation(
    driverId: string,
    input: RecordViolationInput,
  ): Promise<DriverViolation>;
  async recordIncident(
    driverId: string,
    input: RecordIncidentInput,
  ): Promise<DriverIncident>;
  async suspendDriver(
    driverId: string,
    reason: string,
    days: number,
  ): Promise<Driver>;
  async unsuspendDriver(driverId: string): Promise<Driver>;
  async deactivate(driverId: string, reason: string): Promise<Driver>;
}
```

---

## Phase 6-11: Supporting Operations

### **ShipmentStop Entity** (Phases 7-8, 10-11)

**State Machine:**

```
PLANNED → IN_TRANSIT → COMPLETED → ARCHIVED
            ↓
          SKIPPED
```

**Prisma Model:**

```prisma
model ShipmentStop {
  id                  String @id @default(cuid())
  shipmentId          String
  shipment            Shipment @relation(fields: [shipmentId], references: [id])
  sequence            Int     // Order in route (1, 2, 3...)
  location            Location
  stopType            String  // PICKUP | DROPOFF | WAYPOINT
  status              String  // PLANNED | IN_TRANSIT | COMPLETED | SKIPPED
  plannedArrival      DateTime
  actualArrival       DateTime?
  completionProof     String?
  notes               String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

**Business Rules:**

- Stops ordered by sequence (1, 2, 3...)
- Cannot reorder after IN_TRANSIT
- Completion requires proof (photo/signature)
- Arriving late triggers notification

### **ShipmentEvent Entity** (Phases 2-11 - Audit Trail)

**State:** Immutable (write-once, append-only)

**Prisma Model:**

```prisma
model ShipmentEvent {
  id                  String @id @default(cuid())
  shipmentId          String
  shipment            Shipment @relation(fields: [shipmentId], references: [id])
  eventType           String  // POSTED | BID_RECEIVED | BID_ACCEPTED | ASSIGNED | DEPARTED | ARRIVED | DELIVERED | CANCELLED
  eventData           Json    // Event details
  createdBy           String  // User ID
  createdAt           DateTime @default(now())
}
```

**Business Rules:**

- Never update or delete
- Log every state change
- Log every significant action

### **BrokerCarrierContract Entity** (Phase 6)

**State Machine:**

```
PROPOSED → NEGOTIATION → ACCEPTED → ACTIVE → COMPLETED → ARCHIVED
               ↓
             REJECTED
```

**Prisma Model:**

```prisma
model BrokerCarrierContract {
  id                  String @id @default(cuid())
  shipmentId          String
  shipment            Shipment? @relation(fields: [shipmentId], references: [id])
  brokerId            String
  broker              Broker @relation(fields: [brokerId], references: [id])
  carrierId           String
  carrier             Carrier @relation(fields: [carrierId], references: [id])
  status              String  // PROPOSED | NEGOTIATION | ACCEPTED | ACTIVE | COMPLETED | REJECTED | ARCHIVED
  terms               String[] // Payment terms, responsibilities
  currency            String
  totalValue          Decimal
  startDate           DateTime
  endDate             DateTime
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

---

## Summary Table

| Entity        | Model                 | Phases | State Count | Complexity                  |
| ------------- | --------------------- | ------ | ----------- | --------------------------- |
| Freight       | Freight               | 1-11   | 8           | Medium (ownership rules)    |
| Shipment      | Shipment              | 2-11   | 9           | High (multi-actor workflow) |
| ShipmentBid   | ShipmentBid           | 4-6    | 7           | High (compliance rules)     |
| Vehicle       | Vehicle               | 3-11   | 4           | Low (maintenance states)    |
| Driver        | Driver                | 3-11   | 4           | Low (suspension rules)      |
| ShipmentStop  | ShipmentStop          | 7-11   | 4           | Low (linear progression)    |
| ShipmentEvent | ShipmentEvent         | 2-11   | Immutable   | Low (append-only)           |
| Contract      | BrokerCarrierContract | 6      | 7           | Medium (negotiation)        |

---

## Key Invariants (Must Hold Always)

1. **Shipment cannot select bid from non-compliant bidder**
2. **Driver in shipment must have valid license**
3. **Vehicle in shipment must be ACTIVE**
4. **Only one bid accepted per shipment**
5. **Stop sequence must be ordered 1, 2, 3, ... no gaps**
6. **Freight cannot be in two shipments simultaneously** (via ShipmentFreight junction)
7. **Shipment cannot move to IN_TRANSIT without assigned vehicle**
8. **Shipment cannot move to DELIVERED without all stops completed**

---

## Validation Responsibility

- **Repository**: Data exists, type safety
- **Service**: Business rules, invariants, state transitions
- **GraphQL Resolver**: Request validation, authorization
- **Middleware**: Authentication, rate limiting
