# Feature-Sliced Design (FSD) Architecture

## Principles

1. **Vertical Slices** - Organize by business feature, not technical layers
2. **Independence** - Features should be importable and reusable in isolation
3. **No Cross-Imports** - Features don't depend on each other
4. **Consistent Structure** - Every feature follows same folder pattern

---

## Domain Groups

### **1. Parties** (User Types in the System)

**File:** `server/services/parties/`

| Entity | Model | Role |
|--------|-------|------|
| **User** | User | Core identity (SF-01) |
| **Broker** | Broker | Intermediary (Phase 2-11) |
| **Carrier** | Carrier | Transporter (Phase 3-10) |
| **Driver** | Driver | Operator |
| **FreightOwner** | FreightOwner | Shipper (Phase 1) |
| **Warehouse** | Warehouse | Storage facility |

**Service Pattern:**
```
parties/broker/
├── repository.ts      → Prisma queries
├── service.ts         → Business logic
└── types.ts          → Response types (optional, use Prisma)
```

---

### **2. Objects** (Core Business Entities)

**File:** `server/services/objects/`

| Entity | Model | Purpose |
|--------|-------|---------|
| **Freight** | Freight | Physical cargo (Phase 1) |
| **Shipment** | Shipment | Coordinated transport (Phase 2-11) |
| **Vehicle** | Truck | Transportation asset |

**Service Pattern:**
```
objects/freight/
├── repository.ts      → Prisma queries
├── service.ts         → Freight lifecycle + rules
└── types.ts          → Response types
```

---

### **3. Supporting** (Cross-Domain Services)

**File:** `server/services/supporting/`

| Entity | Model | Purpose |
|--------|-------|---------|
| **Bidding** | ShipmentBid | Auction system (Phase 4-5) |
| **BidRules** | BidRule | Auto-validation (Phase 4) |
| **Contracts** | BrokerCarrierContract | Long-term agreements |
| **Junctions** | ShipmentFreight, ShipmentStop, etc. | Many-to-many mappings |
| **Audit** | ShipmentEvent, ShipmentLog | Immutable event trail |
| **Penalties** | CancellationFee, PenaltyPayment | Fee distribution |
| **Reviews** | Review | Rating system (Phase 11) |
| **Compliance** | DriverViolation, DriverIncident | Regulatory checks |
| **Maintenance** | TruckMaintenance, TruckInspection | Vehicle upkeep |

**Service Pattern:**
```
supporting/bidding/
├── repository.ts      → Prisma queries
├── service.ts         → Bidding logic + validation
└── types.ts          → Response types
```

---

## GraphQL Resolver Organization

### **Parties Resolvers**
```
graphql/resolvers/parties/
├── Broker/
│   ├── queries.ts         (getBroker, listBrokers, searchBrokers)
│   └── mutations.ts       (createBroker, updateBroker)
├── Carrier/
│   ├── queries.ts         (getCarrier, listCarriers)
│   └── mutations.ts       (createCarrier, updateCarrier)
└── Driver/
    ├── queries.ts
    └── mutations.ts
```

### **Objects Resolvers**
```
graphql/resolvers/objects/
├── Freight/
│   ├── queries.ts         (getFreight, listFreights, listAvailable)
│   ├── mutations.ts       (createFreight, updateFreight, archiveFreight)
│   └── fields.ts          (broker, owner, warehouse field resolvers)
├── Shipment/
│   ├── queries.ts
│   ├── mutations.ts
│   └── fields.ts
└── Vehicle/
```

### **Supporting Resolvers**
```
graphql/resolvers/supporting/
├── Bidding/
│   ├── queries.ts         (getBid, listBids, getBidRules)
│   └── mutations.ts       (createBid, updateBid, createBidRule)
├── Audit/
│   ├── queries.ts         (getShipmentEvents, listAudits)
│   └── fields.ts
└── Penalties/
```

---

## Dependency Graph (What Can Import What)

```
Frontend (app/, features/, entities/)
    ↓ (imports from)
GraphQL Resolvers (graphql/resolvers/)
    ↓ (imports from)
Services (services/)
    ↓ (imports from)
Repositories (services/*/repository.ts)
    ↓ (imports from)
Prisma Client (db/generated/prisma/)
    ↓
Database
```

**Rules:**
- ✅ Resolvers → Services (direction: down)
- ✅ Services → Repositories (direction: down)
- ✅ Repositories → Prisma only (direction: down)
- ❌ Services → Resolvers (circular!)
- ❌ Repository → Another Repository (cross-domain without service)
- ❌ Resolvers → Other Resolvers directly

---

## File Naming Conventions

| File | Pattern | Example |
|------|---------|---------|
| **Repository** | `{entity}Repository.ts` | `BrokerRepository.ts` |
| **Service** | `{entity}Service.ts` | `BrokerService.ts` |
| **Resolver** | `{entity}Resolver.ts` | `BrokerResolver.ts` |
| **Types** | `types.ts` (or use Prisma) | `types.ts` |
| **Constants** | `constants.ts` | `constants.ts` |
| **Tests** | `{entity}.test.ts` | `broker.test.ts` |

---

## Module Exports (No Wildcards)

**❌ Bad:**
```typescript
// broker/index.ts
export * from './repository';
export * from './service';  // Causes naming conflicts
```

**✅ Good:**
```typescript
// broker/index.ts
export { BrokerRepository } from './repository';
export { BrokerService } from './service';

// Or explicit imports in parent:
import { BrokerService } from './broker/service';
import { BrokerRepository } from './broker/repository';
```

---

## Adding a New Feature (Example: WarehouseNeed)

**Step 1:** Create Prisma Model
```prisma
// db/prisma/models/objects/warehouse-need.prisma
model WarehouseNeed {
  id            String @id @default(cuid())
  warehouseId   String
  warehouse     Warehouse @relation(fields: [warehouseId], references: [id])
  // ... fields
}
```

**Step 2:** Create Repository
```typescript
// services/objects/warehouse-need/repository.ts
export class WarehouseNeedRepository {
  constructor(private prisma: PrismaClient) {}
  async findById(id: string) { /* Prisma query */ }
  async create(input) { /* Prisma query */ }
  // ...
}
```

**Step 3:** Create Service
```typescript
// services/objects/warehouse-need/service.ts
export class WarehouseNeedService extends BaseService {
  async getWarehouseNeed(id: string) { /* business logic */ }
  async submitBid(needId, bidInput) { /* validation + call repo */ }
  // ...
}
```

**Step 4:** Create Resolver (Functions, Not Classes)
```typescript
// graphql/resolvers/objects/WarehouseNeed/queries.ts
export const createWarehouseNeedQueries = (deps: ResolverDependencies) => ({
  getWarehouseNeed: async (_parent, args, ctx) =>
    ctx.services.warehouseNeedService.getWarehouseNeed(args.id),
});

// graphql/resolvers/objects/WarehouseNeed/mutations.ts
export const createWarehouseNeedMutations = (deps: ResolverDependencies) => ({
  submitBid: async (_parent, args, ctx) =>
    ctx.services.warehouseNeedService.submitBid(args.needId, args.input),
});
```

**Step 5:** Register in Context
```typescript
// graphql/context-builder/context-builder.ts
const warehouseNeedService = new WarehouseNeedService(warehouseNeedRepository);
return {
  services: {
    // ...
    warehouseNeedService,
  },
};
```

**Step 6:** Add to GraphQL Schema
```graphql
# graphql/schema/typedefs.graphql
type WarehouseNeed {
  id: ID!
  warehouse: Warehouse!
  # ... fields
}

extend type Query {
  getWarehouseNeed(id: ID!): WarehouseNeed
}

extend type Mutation {
  submitBid(needId: ID!, input: BidInput!): ShipmentBid
}
```

**Done.** Pattern enforced across all features.

---

## Benefits of FSD

✅ Clear ownership (who owns Broker? owner of parties/broker/)
✅ Feature independence (Broker doesn't know about Carrier internals)
✅ Easy to extend (add method to BrokerService, not touching Carrier)
✅ Easy to test (mock BrokerRepository, test BrokerService)
✅ Consistent structure (every feature same pattern)
✅ Scalable (add 100 features, same structure)
