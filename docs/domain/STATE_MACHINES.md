# State Machines & Transitions

## Freight State Machine

### Diagram

```
                                ┌──────────────────┐
                                │   IN_TRANSIT     │
                                │   (Phase 9-10)   │
                                └──────────────────┘
                                        ↑
                                        │ startTransit()
                                        │ [shipment.status === BID_SELECTED]
                                        │
                  ┌─────────────────────┴──────────────────────┐
                  │                                            │
        ┌─────────v──────────┐                    ┌────────────v──────────┐
        │  ASSIGNED          │                    │  IN_PLANNING          │
        │  (Phase 8)         │                    │  (Phase 7-8)          │
        └──────┬─────────────┘                    └────────┬───────────────┘
               │ selectBid() + planRoutes()              │ planRoutes()
               │                                         │
        ┌──────v──────────────────────────────────────────v──────┐
        │         BID_SELECTED                                   │
        │         (Phase 6 - Contract Negotiation)               │
        └──────┬───────────────────────────────────────────────┬─┘
               │ [Multiple bids available, select one]          │ NO validation
               │                                                │ errors yet
        ┌──────v──────────────┐                    ┌────────────v──────────┐
        │  BIDS_RECEIVED      │                    │  BIDDING_OPEN         │
        │  (Phase 4-5)        │                    │  (Phase 4-5)          │
        │  ≥1 bid exists      │◄──────acceptBid()──┤  (Accepting bids)    │
        └──────┬──────────────┘                    └────────┬───────────────┘
               │ closeBidding() → need selectBid()         │ openBidding()
               │                                           │
        ┌──────v────────────────────────────────────────────v──────┐
        │         POSTED                                           │
        │         (Phase 2 - Shipment Created)                     │
        │         Awaiting action: open bidding or manual award    │
        └──────┬──────────────────────────────────────┬────────────┘
               │ createShipment()                     │ cancel if disputes
               │                                      │
               │ ┌──────────────────────────────────┐ │
               └──►  Created by broker or carrier  ◄─┘
                     (Status, Freights initialized)
```

### **Key Transitions**

| From                  | To            | Method                   | Conditions       | Role                             |
| --------------------- | ------------- | ------------------------ | ---------------- | -------------------------------- |
| POSTED                | BIDDING_OPEN  | `openBidding()`          | None             | Broker or Carrier                |
| BIDDING_OPEN          | BIDS_RECEIVED | (Auto) on first bid      | ≥1 bid submitted | Carrier/Broker bidding           |
| BIDS_RECEIVED         | BID_SELECTED  | `selectBid()`            | Choose bid ID    | Posting broker/carrier           |
| BID_SELECTED          | IN_PLANNING   | `planRoutes()`           | Create stops     | Broker or carrier                |
| IN_PLANNING           | IN_TRANSIT    | `startTransit()`         | Vehicle assigned | Dispatcher                       |
| IN_TRANSIT            | DELIVERED     | `completeStop()` on last | All stops done   | Driver or proofs system          |
| [Any]                 | CANCELLED     | `cancelShipment()`       | Reason provided  | Posting party (before DELIVERED) |
| [Any except ARCHIVED] | ARCHIVED      | `archiveShipment()`      | Manual action    | Admin                            |

### **Validation Rules for Transitions**

```typescript
// POSTED → BIDDING_OPEN
canOpenBidding(shipment) {
  return shipment.status === 'POSTED' && shipment.freights.length > 0;
}

// BIDS_RECEIVED → BID_SELECTED
canSelectBid(shipment, bidId) {
  return (
    shipment.status === 'BIDS_RECEIVED' &&
    shipment.bids.some(b => b.id === bidId && b.compliance === 'COMPLIANT')
  );
}

// BID_SELECTED → IN_PLANNING
canPlanRoutes(shipment) {
  return (
    shipment.status === 'BID_SELECTED' &&
    shipment.selectedBid !== null &&
    shipment.stops.length > 0
  );
}

// IN_PLANNING → IN_TRANSIT
canStartTransit(shipment) {
  return (
    shipment.status === 'IN_PLANNING' &&
    shipment.vehicle !== null &&
    shipment.driver !== null &&
    shipment.stops.every(s => s.status === 'PLANNED')
  );
}

// IN_TRANSIT → DELIVERED
canCompleteShipment(shipment) {
  return (
    shipment.status === 'IN_TRANSIT' &&
    shipment.stops.every(s => s.status === 'COMPLETED')
  );
}

// Any → CANCELLED
canCancel(shipment) {
  return shipment.status !== 'DELIVERED' && shipment.status !== 'ARCHIVED';
}
```

---

## Bid State Machine

### Diagram

```
                              ┌─────────────────┐
                              │    ACCEPTED     │
                              │   (Phase 6)     │
                              │ Shipment chose  │
                              │   this bid      │
                              └────────┬────────┘
                                       │ (End of bidding process)
                                       │
         ┌─────────────────────────────┘
         │
         │ selectBid(shipmentId, bidId)
         │ [Must be RULE_COMPLIANT]
         │
    ┌────v──────────────┐
    │ RULE_COMPLIANT    │
    │ (Phase 4-5)       │
    │ Passed all rules  │
    └────┬──────────────┘
         │ Auto-transition on evaluation complete
         │
    ┌────v──────────────────────────────────┐
    │ RULE_EVAL                             │
    │ (Auto - checking BidRule configs)     │
    │ Evaluates against shipment's BidRules │
    └────┬──────────────────┬───────────────┘
         │ If all pass      │ If any fail
    ┌────v──────────────┐   └──────────┐
    │ RULE_COMPLIANT    │              │
    └────┬──────────────┘        ┌─────v──────────────┐
         │                       │ NON_COMPLIANT      │
         │                       │ (Phase 4-5)        │
         │                       │ Failed rule check  │
         │                       └────┬───────────────┘
         │                            │
         │ [Shipment can still choose │ [Cannot be selected]
         │  if COMPLIANT or accept     │ rejectBid() or
         │  non-compliant if needed]   │ withdrawBid()
         │                            │
         │┌────────────────────────────┘
         ││
    ┌────v─────────────────┐
    │ PENDING              │
    │ (Just created)       │
    │ (Microseconds only)  │
    └────┬──────────────────┘
         │ submitBid()
         │
         └──→ Runs compliance check
             Sets status to RULE_EVAL
             Auto-evaluates rules
             Sets to COMPLIANT or NON_COMPLIANT

    [At any point except ACCEPTED]
                ↓
    [Can call withdrawBid()]
                ↓
    ┌──────────────────────┐
    │ WITHDRAWN            │
    │ (Bidder cancelled)   │
    └──────────────────────┘
```

### **Key Transitions**

| From                         | To             | Method          | Conditions               | Role                   |
| ---------------------------- | -------------- | --------------- | ------------------------ | ---------------------- |
| (new)                        | PENDING        | `submitBid()`   | Input valid              | Carrier or Broker      |
| PENDING                      | RULE_EVAL      | (Auto)          | Immediately after submit | System                 |
| RULE_EVAL                    | RULE_COMPLIANT | (Auto)          | All BidRules pass        | System                 |
| RULE_EVAL                    | NON_COMPLIANT  | (Auto)          | ≥1 BidRule fails         | System                 |
| RULE_COMPLIANT/NON_COMPLIANT | ACCEPTED       | `selectBid()`   | Shipment chooses this    | Posting broker/carrier |
| RULE_COMPLIANT/NON_COMPLIANT | REJECTED       | `rejectBid()`   | Shipment rejects         | Posting broker/carrier |
| [Any except ACCEPTED]        | WITHDRAWN      | `withdrawBid()` | Bidder cancels           | Bidding carrier/broker |

### **Validation Rules for Transitions**

```typescript
// submitBid()
canSubmitBid(bid) {
  return (
    bid.shipment.status === 'BIDDING_OPEN' &&
    bid.bidderType !== null &&
    bid.price > 0 &&
    bid.estimatedDays > 0
  );
}

// selectBid() - Shipment selecting this bid as winner
canSelectBidAsWinner(bid) {
  return (
    bid.status === 'RULE_COMPLIANT' ||
    (bid.status === 'NON_COMPLIANT' && overrideApproved)
  );
}

// rejectBid()
canRejectBid(bid) {
  return bid.status !== 'ACCEPTED' && bid.status !== 'WITHDRAWN';
}

// withdrawBid()
canWithdrawBid(bid) {
  return bid.status !== 'ACCEPTED' && bid.status !== 'WITHDRAWN';
}
```

### **BidRule Evaluation (RULE_EVAL → RULE_COMPLIANT/NON_COMPLIANT)**

**Built-in Rules:**

```typescript
enum BidRuleType {
  PRICE_RANGE = "PRICE_RANGE", // Min ≤ bid.price ≤ Max
  CARRIER_REQUIREMENT = "CARRIER_REQUIREMENT", // Bid must be from specific carrier
  DRIVER_LICENSE_CHECK = "DRIVER_LICENSE_CHECK", // All drivers must have valid license
  VEHICLE_CAPACITY = "VEHICLE_CAPACITY", // Vehicle capacity ≥ freight weight
  MAX_BIDS_PER_CARRIER = "MAX_BIDS_PER_CARRIER", // Only N bids per carrier
  REPUTATION_SCORE = "REPUTATION_SCORE", // Carrier avgRating ≥ min
  NO_RECENT_VIOLATIONS = "NO_RECENT_VIOLATIONS", // No violations in last N days
}
```

**Compliance Check Flow:**

```typescript
async evaluateBidCompliance(bid: ShipmentBid) {
  const shipment = bid.shipment;
  const rules = shipment.bidRules;

  const results = await Promise.all(
    rules.map(rule => evaluateRule(bid, rule))
  );

  const allPass = results.every(r => r.passed);

  bid.compliance = allPass ? 'RULE_COMPLIANT' : 'NON_COMPLIANT';
  bid.complianceReason = results
    .filter(r => !r.passed)
    .map(r => r.message)
    .join('; ');

  return bid.save();
}
```

---

## Vehicle State Machine

### Diagram

```
┌─────────────┐
│   ACTIVE    │◄──────── returnFromMaintenance()
│ (Operating) │          [Inspection done, cleared]
└──────┬──────┘
       │
       │ moveToMaintenance(reason)
       │ [No active shipments]
       │
    ┌──v──────────────┐
    │  MAINTENANCE    │
    │  (Being serviced)
    └──┬──────────────┘
       │
       │ returnFromMaintenance()
       │
       └─→ ACTIVE (restart operations)

┌──────────────────────┐
│                      │
│  [At any time]       │
│  decommission() or   │
│  archive()           │
│         ↓            │
│  INACTIVE            │
│  or                  │
│  ARCHIVED            │
└──────────────────────┘
```

### **Key Transitions**

| From               | To          | Method                    | Conditions          | Role          |
| ------------------ | ----------- | ------------------------- | ------------------- | ------------- |
| ACTIVE             | MAINTENANCE | `moveToMaintenance()`     | No active shipments | Fleet manager |
| MAINTENANCE        | ACTIVE      | `returnFromMaintenance()` | Inspection complete | Fleet manager |
| ACTIVE/MAINTENANCE | INACTIVE    | `decommission()`          | Manual              | Fleet manager |
| [Any]              | ARCHIVED    | `archive()`               | Manual              | Admin         |

---

## Driver State Machine

### Diagram

```
              ┌────────────────────────┐
              │      ACTIVE            │
              │  (Available to drive)   │
              └──┬────────────────────┬─┘
                 │                    │
          ┌──────v──────────┐  recordViolation() if 3+ violations
          │   recordViolation()      │
          │   Or incident       └────v──────────────┐
          │                                         │
          │                        ┌────────────────v──────┐
          │                        │ SUSPENDED             │
          │                        │ (Violations/Incidents)│
          │                        │ (30 day auto-unsuspend)
          │                        └────────────┬──────────┘
          │                                    │
          │                    unsuspendDriver()│
          │                    or               │
          │                    auto-unsuspend  │
          │                    (30 days, no new violations)
          │                                    │
          └────────────────────────────────────┘

┌─────────────────────┐
│   [At any time]     │
│   deactivate()      │
│         ↓           │
│   INACTIVE          │
│   [No longer hired] │
└─────────────────────┘

          │
          │ archive()
          ↓
    ┌──────────────┐
    │   ARCHIVED   │
    └──────────────┘
```

### **Key Transitions**

| From             | To        | Method                  | Conditions                        | Role          |
| ---------------- | --------- | ----------------------- | --------------------------------- | ------------- |
| ACTIVE           | SUSPENDED | (Auto) on 3rd violation | `recordViolation()` called 3x     | System        |
| SUSPENDED        | ACTIVE    | `unsuspendDriver()`     | Manual unsuspend                  | Fleet manager |
| SUSPENDED        | ACTIVE    | (Auto)                  | 30 days passed, no new violations | System        |
| ACTIVE/SUSPENDED | INACTIVE  | `deactivate()`          | Manual                            | Fleet manager |
| [Any]            | ARCHIVED  | `archive()`             | Manual                            | Admin         |

### **Violation Rules**

```typescript
async recordViolation(driverId: string, input: RecordViolationInput) {
  const driver = this.drivers.findById(driverId);
  const violations = driver.violations;

  // Create new violation record
  const violation = await this.repository.createViolation({
    driverId,
    type: input.type, // SPEEDING, HARSH_BRAKING, etc.
    description: input.description,
    recordedAt: new Date(),
  });

  // Count violations in past 12 months
  const recentCount = violations.filter(
    v => v.recordedAt > 12monthsAgo
  ).length;

  // If 3rd violation in 12 months, suspend
  if (recentCount >= 3) {
    await this.suspendDriver(driverId, `${recentCount} violations in 12 months`);
  }

  return violation;
}

async unsuspendDriver(driverId: string) {
  const driver = this.drivers.findById(driverId);

  // Check: no violations in past 30 days
  const recentViolations = driver.violations.filter(
    v => v.recordedAt > 30daysAgo
  );

  if (recentViolations.length === 0) {
    driver.status = 'ACTIVE';
    await driver.save();
  }
}

// Auto-unsuspend scheduled daily
async autoUnsuspendExpired() {
  const suspendedDrivers = driver.query.where({ status: 'SUSPENDED' });

  for (const driver of suspendedDrivers) {
    const violationsInLast30Days = driver.violations.filter(
      v => v.recordedAt > 30daysAgo
    );

    if (violationsInLast30Days.length === 0) {
      driver.status = 'ACTIVE';
      await driver.save();
    }
  }
}
```

---

## ShipmentStop State Machine

### Diagram

```
┌─────────────┐
│   PLANNED   │
│ (Scheduled) │
└──────┬──────┘
       │ startTransit() on shipment
       │ [Vehicle departs]
       │
    ┌──v──────────────┐
    │  IN_TRANSIT     │
    │  (En route)     │
    └──┬──────────────┘
       │ arriveAtStop() or
       │ completeStop()
       │ [Driver provides proof]
       │
    ┌──v──────────────┐
    │  COMPLETED      │
    │  (Stop done)    │
    └─────────────────┘

[At any point except COMPLETED]
        │ skipStop() if needed
        ↓
    ┌──────────┐
    │  SKIPPED │
    │ (Not done)
    └──────────┘
```

### **Key Transitions**

| From       | To         | Method                             | Conditions          | Role       |
| ---------- | ---------- | ---------------------------------- | ------------------- | ---------- |
| PLANNED    | IN_TRANSIT | (Auto) via shipment.startTransit() | Shipment IN_TRANSIT | System     |
| IN_TRANSIT | COMPLETED  | `completeStop()`                   | Proof provided      | Driver     |
| IN_TRANSIT | SKIPPED    | `skipStop()`                       | Authorization       | Dispatcher |
| PLANNED    | SKIPPED    | `skipStop()`                       | Before transit      | Dispatcher |

### **Validation Rules**

```typescript
// completeStop()
canCompleteStop(stop) {
  return (
    stop.status === 'IN_TRANSIT' &&
    stop.completionProof !== null && // Photo or signature
    stop.completionProof.length > 0
  );
}

// skipStop()
canSkipStop(stop) {
  return (
    stop.status !== 'COMPLETED' &&
    stop.status !== 'SKIPPED'
  );
}

// Check if all stops can complete shipment
allStopsCompleted(shipment) {
  return shipment.stops.every(s =>
    s.status === 'COMPLETED' || s.status === 'SKIPPED'
  );
}
```

---

## Invariants (Must Always Hold)

1. **Only ONE shipment can have status = "BID_SELECTED" for a given bid** (uniqueness)
2. **A bid with status = "ACCEPTED" must have its shipment in BID_SELECTED or later**
3. **Vehicle in IN_TRANSIT shipment must have status = "ACTIVE"**
4. **Driver in shipment must have `licenseExpiryDate > today()`**
5. **Shipment with status = "IN_TRANSIT" must have ≥1 stop in "IN_TRANSIT"**
6. **All stops in PLANNED state must have `plannedArrival <= next stop's plannedArrival`** (ordered)
7. **Freight cannot be in two different shipments simultaneously** (checked via ShipmentFreight junction)
8. **Stop sequence must be 1, 2, 3, ... with no gaps**

---

## State Transition Guarantees

```
// TypeScript pattern for safe transitions
interface StateTransition<From, To> {
  from: From;
  to: To;
  validate: (entity) => boolean;
  onSuccess: (entity) => Promise<void>;
  onFailure: (entity) => string; // Error message
}

// Example implementation
async transitionFreight(
  freightId: string,
  toState: FreightStatus,
  validator: (f: Freight) => boolean
) {
  const freight = await this.repo.load(freightId);

  if (!validator(freight)) {
    throw new InvalidStateTransition(
      `Cannot transition ${freight.status} → ${toState}`
    );
  }

  freight.status = toState;
  await this.repo.save(freight);

  // Emit event for audit log
  await this.events.emit('FreightStateChanged', {
    freightId,
    from: freight.status,
    to: toState,
    timestamp: new Date(),
  });
}
```

All state transitions should follow this pattern for auditability and safety.
