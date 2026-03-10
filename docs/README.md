# Documentation Index

Welcome to the Razruli project documentation! This guide provides a complete overview of the system architecture, implementation patterns, and how everything works together.

---

## Quick Navigation

### Getting Started

**New to the project?** Start with [System Architecture Overview](system/README.md) to understand how everything connects.

**Looking for specific features?** Use the navigation below to jump to the right section.

---

## 📚 Documentation Structure

### 🗄️ **Server Documentation**

Comprehensive guides for backend implementation, database, GraphQL, and services.

#### Database Schema

- **[Database Documentation](server/db/README.md)** - Prisma schema, models, and database design
  - Complete domain organization (Core, Operations, Analytics, Audit)
  - Sample queries and usage examples
  - File structure and migrations

#### GraphQL API

- **[GraphQL Architecture](server/gql/README.md)** - API design and resolver patterns
  - Middleware stack (Auth, Permissions, Validation)
  - Resolver implementation patterns
  - 200+ resolvers, 95% specification coverage

#### Services & Data Access

- **[Services Layer](server/services/README.md)** - Business logic and service architecture
  - 11 domain services across 4 domains
  - 13 DataLoaders for N+1 prevention
  - Service factory pattern
- **[DataLoaders Deep Dive](server/services/dataloaders.md)** - N+1 query prevention
  - How DataLoaders work
  - Batching mechanisms
  - Performance optimization
- **[Repository Pattern](server/services/repository-pattern.md)** - Data access architecture
  - Service + Repository separation
  - BaseService pattern
  - Cache invalidation strategies

---

### 🔄 **System Documentation**

End-to-end system design and request workflows.

#### System Architecture

- **[System Overview](system/README.md)** - Complete request lifecycle
  - Request processing flow from client to database
  - Context building pipeline
  - Error handling
  - Performance characteristics

#### Request Workflows

- **[Request Workflows & Examples](system/workflows.md)** - Real-world request examples
  - Simple query (Get single employee)
  - Complex query with relationships
  - Create mutation with validation
  - Complex analysis queries
  - Error handling examples
  - Performance metrics

#### Capacity & Workload

- **[Capacity Units System](system/capacity-units.md)** - Workload management formulas
  - Employee capacity calculation (P_day, P_month, P_hour)
  - Coefficient tables (K_grade, K_gen, K_age, K_tenure)
  - Task load formula (L = hours × complexity × difficulty)
  - Load index interpretation
  - Gap analysis and hiring recommendations
  - Complete mathematical formulas

---

### 🔍 **Reference Documentation**

Quick lookups, patterns, and architectural decisions.

#### Quick Reference

- **[Quick Reference Guide](reference/quick-reference.md)** - Cheat sheet for common tasks
  - Services API quick lookup
  - DataLoaders quick lookup
  - Middleware options
  - Resolver patterns
  - Error codes
  - Capacity coefficients
  - File structure

#### Architecture Decisions

- **[Repository Pattern & Architecture Decisions](reference/architecture-decisions.md)** - Design decisions explained
  - Should we use repository pattern?
  - Trade-offs and recommendations
  - Current architecture layers
  - Service factory pattern
  - BaseService pattern
  - Performance considerations

---

### 📱 **Client Documentation**

Frontend documentation and integration guides (in development).

- Client folder: `docs/client/`
- Guides for consuming GraphQL API from frontend
- State management patterns
- Authentication and authorization

---

## 🎯 Common Tasks & Patterns

### I want to...

**Understand how a request flows through the system**
→ Read [System Overview](system/README.md) and [Request Workflows](system/workflows.md)

**Add a new mutation/query**
→ Check [Resolver Patterns](server/gql/README.md#resolver-implementation) and [Quick Reference](reference/quick-reference.md#resolver-patterns)

**Create a new service**
→ Use [Services Layer](server/services/README.md) as guide, follow [BaseService pattern](reference/architecture-decisions.md#base-service-pattern)

**Add a DataLoader**
→ See [DataLoaders Implementation Guide](server/services/dataloaders.md#creating-dataloaders)

**Understand capacity calculations**
→ Read [Capacity Units System](system/capacity-units.md) with all formulas and examples

**Learn about middleware**
→ Check [GraphQL Middleware](server/gql/README.md#middleware-stack) section

**Optimize query performance**
→ See [DataLoaders Deep Dive](server/services/dataloaders.md#performance-tips) and [Quick Reference Performance Tips](reference/quick-reference.md#performance-tips)

**Understand database schema**
→ Read [Database Schema Documentation](server/db/README.md) with all models and relationships

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Client Application (Web/Mobile)         │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     Express Middleware Stack                    │
│     (Auth, CORS, Rate Limiting, Logging)       │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     Apollo Server + Context Builder             │
│     (Fresh DataLoaders, Services, Cache)        │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     GraphQL Middleware Pipeline                 │
│     (Auth, Permissions, Validation, Errors)     │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     Resolvers (Thin Orchestration Layer)        │
│     (Call services, return formatted responses) │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     Service Layer (Business Logic)              │
│     (11 services, cache management,             │
│      cross-domain coordination)                 │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     DataLoaders (N+1 Prevention)                │
│     (13 loaders, automatic batching)            │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     Prisma Client (Type-Safe ORM)               │
│     (Single shared instance)                    │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│     PostgreSQL Database                         │
│     (4 domains, 11 models, 4 audit tables)      │
└─────────────────────────────────────────────────┘
```

---

## 📈 Project Stats

| Metric            | Count | Status         |
| ----------------- | ----- | -------------- |
| GraphQL Resolvers | 200+  | ✅ Complete    |
| Domain Services   | 11    | ✅ Implemented |
| DataLoaders       | 13    | ✅ Batching    |
| Database Models   | 11    | ✅ Organized   |
| Middleware Types  | 4     | ✅ Complete    |
| Schema Coverage   | 95%   | ✅ High        |
| Type Safety       | 100%  | ✅ Full        |

---

## 🏗️ Project Structure

```
razruli/
├── docs/                              ← You are here
│   ├── server/                        (Backend documentation)
│   │   ├── db/              → Database schema & design
│   │   ├── gql/             → GraphQL API & middleware
│   │   └── services/        → Services & DataLoaders
│   ├── system/              (Architecture & workflows)
│   ├── client/              (Frontend guides)
│   └── reference/           (Quick refs & decisions)
│
├── server/
│   ├── graphql/             (Apollo, resolvers, middleware)
│   ├── services/            (11 domain services)
│   ├── db/                  (Prisma, schema, migrations)
│   ├── auth/               (Authentication)
│   ├── utils/              (Helpers)
│   └── types/              (TypeScript definitions)
│
├── app/                    (Next.js app directory)
├── components/             (React components)
├── shared/                 (Shared code)
└── public/                 (Static assets)
```

---

## 🚀 Key Features

### ✅ Complete GraphQL API

- 200+ resolvers spanning 4 domains
- Full middleware stack (auth, permissions, validation)
- Type-safe with GraphQL Codegen

### ✅ N+1 Query Prevention

- 13 DataLoaders with automatic batching
- Batch operations into single queries
- 50x+ performance improvement in typical scenarios

### ✅ Service-Oriented Architecture

- 11 domain services with clear responsibilities
- Business logic separated from data access
- Easy to test and maintain

### ✅ Advanced Workload Management

- Capacity Units system for universal workload currency
- Automatic load calculation and indexing
- Gap analysis with hiring recommendations

### ✅ Production Ready

- Request-scoped caching with invalidation
- Comprehensive error handling
- Full audit trail and compliance tracking

---

## 📖 Documentation Principles

This documentation follows these principles:

1. **Clear Navigation** - Easy to find what you need
2. **Runnable Examples** - Code examples you can copy and use
3. **Deep Explanations** - Why, not just what
4. **Complete Coverage** - All components documented
5. **Real Scenarios** - Examples based on actual use cases
6. **Visual Aids** - Diagrams and tables for clarity
7. **Quick References** - Cheat sheets for quick lookup

---

## 🔄 Related Projects

Coming soon: Links to related projects and integrations.

---

## 📞 Getting Help

- **Architecture questions?** → [System Overview](system/README.md)
- **Code examples?** → [Request Workflows](system/workflows.md)
- **Quick lookup?** → [Quick Reference](reference/quick-reference.md)
- **Design decisions?** → [Architecture Decisions](reference/architecture-decisions.md)

---

## Version

**Documentation Version:** 1.0  
**Last Updated:** March 10, 2026  
**Status:** ✅ Production Ready

---

**Happy coding! 🚀**
