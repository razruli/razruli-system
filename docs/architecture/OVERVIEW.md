# Gruzin Platform - Architecture Overview

## Project Purpose

Gruzin is a **freight brokerage platform** connecting freight owners, brokers, carriers, and warehouses through a real-time bidding system.

**Core Workflow:**
1. Freight Owner posts cargo specs + budget
2. Broker claims freight, defines shipment route + pricing
3. Carriers bid on shipment (automated rule validation)
4. Broker selects winning bid (lowest compliant rate)
5. Carrier executes shipment + gets paid
6. Review/rating system for future trust

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + TypeScript | 14.x |
| **Backend** | Node.js + Express/Apollo | 20.x |
| **Database** | PostgreSQL + Prisma | 5.x |
| **GraphQL** | Apollo Server + Codegen | 4.x |
| **Auth** | NextAuth.js v5 | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **Type Safety** | TypeScript + Codegen | 5.6+ |

---

## Architecture Layers (Bottom-Up)

```
┌─────────────────────────────────┐
│   Frontend (Next.js App)        │ - User interface
├─────────────────────────────────┤
│   GraphQL API (Apollo Server)   │ - Query/Mutation resolvers
├─────────────────────────────────┤
│   Service Layer                 │ - Business logic + state validation
├─────────────────────────────────┤
│   Repository Layer              │ - Prisma queries (CRUD)
├─────────────────────────────────┤
│   Database (PostgreSQL)         │ - Persistent data store
├─────────────────────────────────┤
│   Auth Layer (NextAuth)         │ - User authentication + JWT
└─────────────────────────────────┘
```

---

## Codebase Organization (FSD - Feature-Sliced Design)

### **Server-Side Structure**

```
server/
├── db/
│   ├── prisma/
│   │   ├── schema.prisma          (Master schema definition)
│   │   ├── models/                (Per-domain model definitions)
│   │   │   ├── parties/           (Broker, Carrier, Driver, etc.)
│   │   │   ├── objects/           (Freight, Shipment, Vehicle)
│   │   │   └── supporting/        (Bid, Rules, Contracts)
│   │   ├── migrations/            (Database migrations)
│   │   └── seed.ts                (Seed data script)
│   └── generated/
│       └── prisma/                (Prisma client - AUTO GENERATED)
│
├── services/
│   ├── parties/
│   │   ├── broker/                (BrokerService + BrokerRepository)
│   │   ├── carrier/               (CarrierService + CarrierRepository)
│   │   ├── driver/                (DriverService + DriverRepository)
│   │   └── ...
│   ├── objects/
│   │   ├── freight/               (FreightService + FreightRepository)
│   │   ├── shipment/              (ShipmentService + ShipmentRepository)
│   │   └── vehicle/               (VehicleService + VehicleRepository)
│   └── supporting/
│       ├── bidding/               (BiddingService + BiddingRepository)
│       ├── audit/                 (AuditService + AuditRepository)
│       └── ...
│
├── graphql/
│   ├── schema/
│   │   ├── typedefs.graphql       (GraphQL type definitions)
│   │   └── schema.graphql         (Complete schema)
│   ├── resolvers/
│   │   ├── parties/               (Broker, Carrier, Driver, etc. resolvers)
│   │   ├── objects/               (Freight, Shipment, Vehicle resolvers)
│   │   ├── supporting/            (Bid, Audit, etc. resolvers)
│   │   ├── queryResolvers.ts      (Root Query handlers)
│   │   └── mutationsResolver.ts   (Root Mutation handlers)
│   ├── context.ts                 (GraphQL context - services + loaders)
│   ├── context-builder/           (Context initialization)
│   ├── lib/
│   │   ├── base-resolver.ts       (Base class for resolvers)
│   │   ├── ResolverDependencies   (Deps injection for resolvers)
│   │   └── helpers/               (Utility functions)
│   └── server.ts                  (Apollo Server setup)
│
├── utils/
│   ├── errors/                    (Custom error types)
│   └── logger/                    (Logging utility)
└── cron/
    └── bidding-deadline/          (Scheduled bidding closure)
```

### **Frontend Structure**

```
app/
├── [locale]/                      (Internationalization)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/                 (Dashboard pages)
│   └── user/                      (User management pages)
├── api/
│   ├── auth/                      (Auth routes)
│   └── graphql/                   (GraphQL endpoint)
└── provider/
    └── RootProviders.tsx          (Auth + Apollo client setup)

features/
└── user/                          (Feature-specific UI components)
    ├── ui/                        (Components)
    ├── model/                     (Feature logic hooks)
    └── config/                    (Feature configuration)

entities/
├── user/                          (Domain entity - User)
├── example/                       (Domain entity - Example)
└── ...

shared/
├── graphql/
│   ├── client/                    (Apollo client setup)
│   ├── generated/                 (Codegen output - AUTO GENERATED)
│   └── hooks/                     (GraphQL hook helpers)
└── ui/                            (Reusable UI components)
```

---

## Service Layer Architecture

**Pattern:** Repository → Service → Resolver

### **Repository Layer**
- **Single Responsibility:** Prisma queries only
- **No Business Logic:** Direct database access
- **Return Type:** Prisma models (auto-generated types)
- **Methods:** findById, create, update, delete, search

### **Service Layer**
- **Business Logic:** State validation, rules enforcement, domain rules
- **Dependencies:** Repository + Context loaders
- **Error Handling:** Throw ValidationError, NotFoundError
- **Return Type:** Domain Response types (Freight, Shipment, etc.)

### **Resolver Layer**
- **Routing Only:** Call service, handle GraphQL response
- **Middleware:** Auth, logging, transaction validation
- **Type Safety:** GraphQL codegen types
- **No Business Logic:** Should be 2-3 lines calling service

---

## Data Flow Example: Create Shipment

```
Frontend (GraphQL Mutation)
    ↓
Apollo Server (GraphQL Parser)
    ↓
ShipmentResolver.createShipment()
    ↓
ShipmentService.createShipment()
    - Validate input (required fields)
    - Check Freight exists + is available
    - Check Broker has freight claim
    - Insert Shipment record
    - Emit ShipmentCreated event
    ↓
ShipmentRepository.create()
    - prisma.shipment.create()
    ↓
Database (INSERT shipment)
    ↓
Response → Frontend
```

---

## Current State

| Component | Status | Notes |
|-----------|--------|-------|
| **Prisma Schema** | ✅ Complete | 20+ models, migrations ready |
| **Database** | ✅ Running | PostgreSQL with migrations applied |
| **Services** | 🟡 Partial | 17 services exist, some incomplete methods |
| **Repositories** | 🟡 Partial | Basic CRUD, type safety issues |
| **GraphQL Schema** | ✅ Complete | All types defined in typedefs.graphql |
| **GraphQL Resolvers** | 🟡 Mixed | Class + module patterns, needs consolidation |
| **Frontend** | 🟡 Partial | UI components exist, GraphQL integration WIP |
| **Auth** | ✅ Setup | NextAuth.js configured, middleware ready |
| **Tests** | ❌ Missing | No test coverage yet |
| **Error Handling** | 🟡 Partial | Custom errors defined, not used consistently |

---

## Key Architectural Decisions

1. **FSD (Feature-Sliced Design)** - Organize by domain (parties/objects/supporting)
2. **Separation of Concerns** - Repo → Service → Resolver layers
3. **Prisma First** - Schema is source of truth for all types
4. **GraphQL Codegen** - Auto-generate types from schema
5. **Context-based DI** - Request-scoped services + loaders
6. **DataLoaders** - Batch loading to prevent N+1 queries
7. **Event-driven Audit** - ShipmentEvent for immutable audit trail
8. **State Machines** - FSM enforced in services, not DB
9. **Error Typing** - Distinct error types for different failures
10. **Solo Development** - Simple patterns over enterprise boilerplate

---

## Next Steps

See [CURRENT_STATE.md](../status/CURRENT_STATE.md) for detailed work items prioritized by impact.
