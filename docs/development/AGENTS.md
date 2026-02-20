# AGENTS.md - Development Rules & Patterns

## Purpose

This file defines the rules that ANY developer (human or AI) must follow when working on the Gruzin codebase.

**Golden Rule:** Follow FSD. Follow ONE resolver pattern. Use Prisma types. No custom types duplicating Prisma. No circular imports. No hidden complexity.

---

## 1. Feature-Sliced Design (FSD) - Mandatory

### What You Cannot Do

❌ **Import across features**
```typescript
// FORBIDDEN
import { BrokerService } from '../../parties/broker/service';
// Accessed from: services/objects/freight/service.ts

// This creates hidden dependency graphs, makes refactoring hard
```

❌ **Put domain logic in resolvers**
```typescript
// FORBIDDEN - Complex logic in resolver
export const getFreightOwnerQuery = (_parent, args, ctx) => {
  const ownerBids = owner.shipments
    .filter(s => s.status === 'BIDDING_OPEN')
    .reduce((sum, s) => sum + s.bids.length, 0);
  // ... 50 lines more
};

// CORRECT - Logic in service
class FreightOwnerService {
  async getActiveBidCount(ownerId: string): Promise<number> {
    // ...
  }
}
```

❌ **Import utilities without path**
```typescript
// FORBIDDEN
import { calculateFee } from '../../../utils';

// CORRECT - Use absolute path from workspace root
import { calculateFee } from '@/server/utils/fee-calculator';
```

### What You MUST Do

✅ **Organize by domains (parties/objects/supporting)**

```
services/
├── parties/         # User types
│   ├── broker/
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── index.ts (exports)
│   ├── carrier/
│   ├── driver/
│   ├── user/
│   ├── freight-owner/
│   └── warehouse/
├── objects/         # Core business entities
│   ├── freight/
│   ├── shipment/
│   └── vehicle/
└── supporting/      # Cross-domain
    ├── bidding/
    ├── audit/
    ├── penalties/
    └── ... (8 total)
```

✅ **One feature = one folder = one domain**

```
brokers/
├── repository.ts    # SELECT *, WHERE, CREATE, UPDATE
├── service.ts       # Business logic, validation
├── types.ts         # (Optional, prefer Prisma types)
└── index.ts         # Exports: { BrokerRepository, BrokerService }
```

✅ **Explicit imports and exports**

```typescript
// broker/index.ts - GOOD
export { BrokerRepository } from './repository';
export { BrokerService } from './service';

// In parent index.ts
export * from './broker';
export * from './carrier';
export * from './driver';
// Now caller can do: import { BrokerService, CarrierService } from '@/server/services/parties';
```

---

## 2. Resolver Pattern - PICK ONE AND STICK

### Current Problem

We have THREE conflicting patterns:

1. **Pattern A: Class methods** (BaseResolver inheritance)
2. **Pattern B: Module factory functions** (createBrokerResolvers)
3. **Pattern C: ResolverDependencies wrapper** (this.deps.composeQuery)

**Result:** Confusion, redundant code, maintenance nightmare.

### Decision: Use Pattern B (Module Factory Functions)

**Why:**
- Simplest (no class boilerplate)
- Matches JavaScript ecosystem (consistent with other codebases)
- GraphQL SDL-first approach naturally maps to function exports
- Apollo Resolver map works with functions, not classes
- Fewer layers → fewer bugs

### Pattern B: Module Factory Functions

```typescript
// graphql/resolvers/parties/broker/queries.ts
import { GraphQLContext } from '@/server/graphql/context';
import { BrokerService } from '@/server/services/parties/broker';

export type BrokerQueryResolvers = {
  getBroker: (parent: any, args: { id: string }, ctx: GraphQLContext) => Promise<any>;
  listBrokers: (parent: any, args: { limit?: number }, ctx: GraphQLContext) => Promise<any[]>;
};

export const createBrokerQueries = (brokerService: BrokerService): BrokerQueryResolvers => ({
  getBroker: async (_parent, args, ctx) => {
    ctx.logger.info(`Query: getBroker(${args.id})`);
    return brokerService.getBroker(args.id);
  },

  listBrokers: async (_parent, args, ctx) => {
    const limit = args.limit || 50;
    return brokerService.listBrokers({ limit });
  },
});

export type BrokerMutationResolvers = {
  createBroker: (parent: any, args: { input: any }, ctx: GraphQLContext) => Promise<any>;
  updateBroker: (parent: any, args: { id: string; input: any }, ctx: GraphQLContext) => Promise<any>;
};

export const createBrokerMutations = (brokerService: BrokerService): BrokerMutationResolvers => ({
  createBroker: async (_parent, args, ctx) => {
    ctx.logger.info(`Mutation: createBroker`);
    return brokerService.createBroker(args.input);
  },

  updateBroker: async (_parent, args, ctx) => {
    return brokerService.updateBroker(args.id, args.input);
  },
});

export type BrokerFieldResolvers = {
  Broker: {
    shipments?: (parent: any, args: any, ctx: GraphQLContext) => Promise<any[]>;
  };
};

export const createBrokerFields = (brokerService: BrokerService): BrokerFieldResolvers => ({
  Broker: {
    shipments: async (broker, _args, ctx) => {
      return brokerService.listShipmentsByBroker(broker.id);
    },
  },
});
```

**In context builder:**

```typescript
// graphql/context-builder/context-builder.ts
const brokerService = new BrokerService(brokerRepository, loaderRegistry);

return {
  Query: {
    ...createBrokerQueries(brokerService),
    ...createCarrierQueries(carrierService),
    // ... more
  },
  Mutation: {
    ...createBrokerMutations(brokerService),
    ...createCarrierMutations(carrierService),
    // ... more
  },
  Broker: {
    ...createBrokerFields(brokerService),
  },
  Carrier: {
    ...createCarrierFields(carrierService),
  },
  // ... more types
};
```

### Pattern B Rules

✅ **File structure:**
```
graphql/resolvers/parties/broker/
├── queries.ts       # export createBrokerQueries()
├── mutations.ts     # export createBrokerMutations()
├── fields.ts        # export createBrokerFields()
└── index.ts         # Re-export all three
```

✅ **Naming convention:**
```typescript
// Query: get<Entity>, list<Entities>, search<Entities>
export const createBrokerQueries = (...) => ({
  getBroker: async (_parent, args, ctx) => { ... },
  listBrokers: async (_parent, args, ctx) => { ... },
  searchBrokers: async (_parent, args, ctx) => { ... },
});

// Mutation: create<Entity>, update<Entity>, delete<Entity>
export const createBrokerMutations = (...) => ({
  createBroker: async (_parent, args, ctx) => { ... },
  updateBroker: async (_parent, args, ctx) => { ... },
  deleteBroker: async (_parent, args, ctx) => { ... },
});

// Field: camelCase matching schema
export const createBrokerFields = (...) => ({
  Broker: {
    shipments: async (broker, _args, ctx) => { ... },
    avgRating: async (broker, _args, ctx) => { ... },
  },
});
```

❌ **REMOVE BaseResolver class** - Not needed
❌ **REMOVE ResolverDependencies wrapper** - Use functions directly
❌ **REMOVE class-based resolvers** - Use functions

---

## 3. Type System - YES to Prisma, NO to Custom Types

### The Rule

Use Prisma types directly. Delete custom response types.

### Current Problem

```typescript
// WRONG - Custom type duplicating Prisma
// server/services/parties/broker/types.ts
export interface BrokerResponse {
  id: string;
  companyName: string;
  registrationNumber: string;
  // ... all same fields as Prisma Broker
}

// EXTRA LAYER - mapToResponse method
class BrokerRepository {
  mapToResponse(broker: Prisma.Broker): BrokerResponse {
    return {
      id: broker.id,
      companyName: broker.companyName,
      // ... copies all fields
    };
  }
}
```

**Why this is wrong:**
1. Duplicates Prisma model definition
2. mapToResponse() does nothing useful
3. Extra type to maintain
4. GraphQL codegen generates types anyway

### The Solution

✅ **Use Prisma types directly:**

```typescript
import { Broker, Carrier, Driver } from '@/server/db/generated/prisma';

class BrokerService {
  async getBroker(id: string): Promise<Broker> {
    return this.repository.findById(id);
  }

  async listBrokers(limit: number): Promise<Broker[]> {
    return this.repository.find({ limit });
  }
}

// In resolver
export const createBrokerQueries = (brokerService: BrokerService) => ({
  getBroker: async (_parent, args, ctx) => {
    // Returns Broker (Prisma type), GraphQL resolves to schema type
    return brokerService.getBroker(args.id);
  },
});
```

✅ **GraphQL codegen generates types for schema:**

```typescript
// shared/graphql/generated/graphql.ts (AUTO-GENERATED)
// 2189 lines of types matching your schema
export type Broker = {
  id: string;
  companyName: string;
  // ... matches GraphQL schema
};

// Use in frontend
import { Broker } from '@/shared/graphql/generated/graphql';

const broker: Broker = brokerData;
```

### Rules

✅ **Import and use Prisma types:**
```typescript
import { Broker, Shipment, Freight } from '@/server/db/generated/prisma';

class BrokerService {
  // Return Prisma types
  async getBroker(id: string): Promise<Broker> { ... }
  async listBrokers(): Promise<Broker[]> { ... }
}
```

❌ **Delete all custom response types:**
```typescript
// DELETE these files:
// server/services/parties/broker/types.ts
// server/services/objects/freight/types.ts
// server/services/parties/driver/types.ts (DriverResponse interface)
// etc.
```

❌ **Delete all mapToResponse methods:**
```typescript
// REMOVE from repositories:
class BrokerRepository {
  // REMOVE THIS:
  mapToResponse(broker: Prisma.Broker): BrokerResponse { ... }
}
```

❌ **Do NOT create intermediary types:**
```typescript
// WRONG
interface FreightDTO {
  id: string;
  number: string;
  // ... same as Freight model
}

// RIGHT - Use Freight directly
import { Freight } from '@/server/db/generated/prisma';
```

---

## 4. Service Layer - Three Layers Only

### Allowed Structure

```
Repository (Prisma queries)
    ↓
Service (Business logic, validation)
    ↓
Resolver (GraphQL endpoint)
```

### Repository Layer

**Responsibility:** Query and mutate database

```typescript
// server/services/parties/broker/repository.ts
import { PrismaClient } from '@/server/db/generated/prisma';

export class BrokerRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.broker.findUnique({ where: { id } });
  }

  async findByRegistration(reg: string) {
    return this.prisma.broker.findUnique({ where: { registrationNumber: reg } });
  }

  async list({ skip = 0, take = 50 } = {}) {
    return this.prisma.broker.findMany({ skip, take });
  }

  async search(filters: BrokerFilters) {
    return this.prisma.broker.findMany({
      where: {
        companyName: { contains: filters.name, mode: 'insensitive' },
      },
    });
  }

  async create(input: CreateBrokerInput) {
    return this.prisma.broker.create({ data: input });
  }

  async update(id: string, input: UpdateBrokerInput) {
    return this.prisma.broker.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    return this.prisma.broker.delete({ where: { id } });
  }
}
```

### Service Layer

**Responsibility:** Business logic, validation, state transitions

```typescript
// server/services/parties/broker/service.ts
import { Broker } from '@/server/db/generated/prisma';
import { BrokerRepository } from './repository';

export class BrokerService {
  constructor(private repository: BrokerRepository) {}

  // Validation: Must have phone
  async createBroker(input: CreateBrokerInput): Promise<Broker> {
    if (!input.phoneNumber) {
      throw new Error('Phone number required');
    }

    if (await this.repository.findByRegistration(input.registrationNumber)) {
      throw new Error('Registration number already exists');
    }

    return this.repository.create(input);
  }

  // Validation: Can only update active brokers
  async updateBroker(id: string, input: UpdateBrokerInput): Promise<Broker> {
    const broker = await this.repository.findById(id);

    if (!broker) {
      throw new Error('Broker not found');
    }

    if (broker.status === 'INACTIVE') {
      throw new Error('Cannot update inactive broker');
    }

    return this.repository.update(id, input);
  }

  // Transactions: Multiple operations
  async assignShipment(brokerId: string, shipmentId: string): Promise<void> {
    const broker = await this.repository.findById(brokerId);
    // More complex logic: verify eligibility, update counters, etc.
  }

  // Queries
  async getBroker(id: string): Promise<Broker> {
    return this.repository.findById(id);
  }

  async listBrokers(pagination: Pagination): Promise<Broker[]> {
    return this.repository.list(pagination);
  }

  async searchBrokers(filters: BrokerFilters): Promise<Broker[]> {
    return this.repository.search(filters);
  }
}
```

### Resolver Layer

**Responsibility:** GraphQL interface, delegating to service

```typescript
// graphql/resolvers/parties/broker/queries.ts
export const createBrokerQueries = (brokerService: BrokerService) => ({
  getBroker: async (_parent, args, ctx) => {
    // Just call service, no logic
    return brokerService.getBroker(args.id);
  },

  listBrokers: async (_parent, args, ctx) => {
    return brokerService.listBrokers({
      skip: args.skip || 0,
      take: args.limit || 50,
    });
  },

  searchBrokers: async (_parent, args, ctx) => {
    return brokerService.searchBrokers(args.filters);
  },
});
```

---

## 5. Error Handling - Consistent Pattern

### Error Classes

```typescript
// server/utils/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', message, 403);
  }
}
```

### Using Errors

```typescript
// In service
async getBroker(id: string): Promise<Broker> {
  const broker = await this.repository.findById(id);

  if (!broker) {
    throw new NotFoundError('Broker');
  }

  return broker;
}

// In resolver
export const createBrokerQueries = (brokerService: BrokerService) => ({
  getBroker: async (_parent, args, ctx) => {
    try {
      return await brokerService.getBroker(args.id);
    } catch (error) {
      ctx.logger.error('getBroker failed', error);
      throw error; // Apollo handles AppError → GraphQL response
    }
  },
});
```

---

## 6. No Circular Dependencies

### The Rule

Service A cannot import Service B if Service B imports Service A.

```
✅ ALLOWED:          ❌ FORBIDDEN:
Repo ← Service       Service A ← Service B
         ↓           Service B ← Service A (Circular!)
        Resolver
```

### Detection

```bash
# Check for circular deps
npm run check:circular

# Or use madge
npx madge --circular server/
```

### Solution: Use Events or Shared Service

```typescript
// WRONG - Circular
class ShipmentService {
  constructor(private bidding: BiddingService) {}
  // ...
}

class BiddingService {
  constructor(private shipment: ShipmentService) {}
  // ...
}

// RIGHT - Event-driven
class ShipmentService {
  async acceptBid(shipmentId: string, bidId: string) {
    // ... logic
    await this.eventBus.emit('BidAccepted', { shipmentId, bidId });
  }
}

class BiddingService {
  constructor(eventBus: EventBus) {
    eventBus.on('BidAccepted', this.handleBidAccepted);
  }
}
```

---

## 7. One Entity at a Time Workflow

### Your Task (REQUIRED WORKFLOW)

1. **Pick ONE entity** (Broker, Carrier, Driver, Freight, Shipment, Vehicle)
2. **Fix end-to-end:**
   - Repository: All CRUD methods
   - Service: All business logic + validation
   - Resolvers: All queries, mutations, fields (ONE PATTERN - factory functions)
   - No custom types (use Prisma directly)
4. **Test completely** (if tests exist)
5. **Get approval** before next entity
6. **Move to next entity**

### Per Entity Checklist

- [ ] Repository methods complete (findById, search, create, update, delete)
- [ ] Service implements all business logic
- [ ] No custom types (deleted response interfaces)
- [ ] Resolvers use factory pattern (not classes, not ResolverDependencies)
- [ ] GraphQL queries/mutations/fields wired in context-builder.ts
- [ ] No circular imports (check with madge)
- [ ] Error handling uses AppError classes
- [ ] Tested with `npm run test` or manual verification
- [ ] Code reviewed by user

---

## 8. GraphQL Schema - Truth Source

### Rule

If it's in the schema, it must be implemented.

### Checking Schema

```bash
cat server/graphql/schema/typedefs.graphql | grep "type Broker" -A 20
```

### Example

```graphql
type Broker {
  id: ID!
  companyName: String!
  registrationNumber: String!
  phoneNumber: String!
  status: String!
  shipments: [Shipment!]!
}

extend type Query {
  getBroker(id: ID!): Broker
  listBrokers(limit: Int): [Broker!]!
  searchBrokers(filter: StringFilter!): [Broker!]!
}

extend type Mutation {
  createBroker(input: CreateBrokerInput!): Broker!
  updateBroker(id: ID!, input: UpdateBrokerInput!): Broker!
  deleteBroker(id: ID!): Boolean!
}
```

**Must implement all:**
- ✅ BrokerRepository.findById, findByNumber, search, create, update, delete
- ✅ BrokerService with business logic
- ✅ createBrokerQueries (getBroker, listBrokers, searchBrokers)
- ✅ createBrokerMutations (createBroker, updateBroker, deleteBroker)
- ✅ createBrokerFields (shipments field resolver)

---

## 9. Logging & Debugging

### Consistent Logger

```typescript
// In service
class BrokerService {
  constructor(
    private repository: BrokerRepository,
    private logger: Logger
  ) {}

  async createBroker(input: CreateBrokerInput): Promise<Broker> {
    this.logger.info('Creating broker', { input });

    try {
      const broker = await this.repository.create(input);
      this.logger.info('Broker created', { brokerId: broker.id });
      return broker;
    } catch (error) {
      this.logger.error('Failed to create broker', error);
      throw error;
    }
  }
}

// In resolver
export const createBrokerMutations = (brokerService: BrokerService) => ({
  createBroker: async (_parent, args, ctx) => {
    ctx.logger.info('Mutation: createBroker');
    return brokerService.createBroker(args.input);
  },
});
```

---

## 10. Validation - Do It in Service

### NOT in Resolver

```typescript
// WRONG - Validation in resolver
export const createBrokerMutations = () => ({
  createBroker: async (_parent, args, ctx) => {
    if (!args.input.companyName) {
      throw new Error('Company name required');
    }
    // ... more validation
  },
});

// RIGHT - Validation in service
class BrokerService {
  async createBroker(input: CreateBrokerInput): Promise<Broker> {
    if (!input.companyName) {
      throw new ValidationError('Company name required');
    }

    // ... more validation

    return this.repository.create(input);
  }
}

// Resolver just calls
export const createBrokerMutations = (brokerService: BrokerService) => ({
  createBroker: async (_parent, args, ctx) => {
    return brokerService.createBroker(args.input);
  },
});
```

---

## Summary: Rules Checklist

✅ **Architecture**
- [ ] FSD: One feature = one folder
- [ ] No cross-feature imports
- [ ] No domain logic in resolvers  
- [ ] Explicit exports, no wildcards

✅ **Resolver Pattern**
- [ ] Use factory functions (createBrokerQueries, etc.)
- [ ] Delete BaseResolver classes
- [ ] Delete ResolverDependencies wrapper
- [ ] Consistent naming: get*, list*, search* / create* update* delete*

✅ **Types**
- [ ] Use Prisma types directly
- [ ] Delete custom response types
- [ ] Delete mapToResponse methods
- [ ] GraphQL types from codegen

✅ **Services**
- [ ] Repository → Service → Resolver (three layers)
- [ ] Business logic in Service, not Resolver
- [ ] Validation in Service, not Resolver

✅ **Errors**
- [ ] Use AppError classes
- [ ] Consistent error messages
- [ ] Proper HTTP status codes

✅ **Workflow**
- [ ] One entity at a time
- [ ] End-to-end: Repo → Service → Resolver
- [ ] User approval before next entity
- [ ] Follow checklist for each entity

❌ **REMOVE**
- [ ] BaseResolver class
- [ ] ResolverDependencies wrapper
- [ ] Custom response types
- [ ] mapToResponse methods
- [ ] Class-based resolvers

---

## For AI Agents

When working on this codebase:

1. **Read this file first** - Understand the rules
2. **Pick ONE entity** - Do it completely
3. **Follow Pattern B** - Factory functions, not classes
4. **Use Prisma types** - Never custom types
5. **Test in isolation** - Service layer first
6. **Show all code changes** - No hidden complexity
7. **Get approval** - Before moving to next

If user says "finish it fully", **DON'T**. Ask: "Which entity shall we finish first? Broker, Carrier, or Driver?"

Smaller pieces = better code = user confidence.
