// ============================================================================
// ARCHITECTURE DIAGRAM - Repository Pattern in Action
// ============================================================================

```
┌─────────────────────────────────────────────────────────────────┐
│                    GraphQL Resolver                             │
│  (Defines what queries/mutations are available)                │
└──────────────────────┬──────────────────────────────────────────┘
                       │ context: ServiceContext
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│               ServiceFactory (DI Container)                     │
│  • factory.getCompanyService()                                  │
│  • factory.getEmployeeService()                                │
│  • ... (8 total)                                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
   │  Company   │ │  Employee  │ │   Grade    │ │  Process   │
   │  Service   │ │  Service   │ │  Service   │ │  Service   │
   └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
         │              │              │              │
         │ Business Logic (validate, cache, coordinate)
         │
         ▼              ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
   │  Company   │ │  Employee  │ │   Grade    │ │  Process   │
   │ Repository │ │ Repository │ │ Repository │ │ Repository │
   └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
         │              │              │              │
         │ Database Access Only (Prisma queries)
         │
         └──────────────┼──────────────┼──────────────┘
                        │
                        ▼
       ┌──────────────────────────────────┐
       │       Prisma Client               │
       │  (Type-safe database access)     │
       └──────────────────────────────────┘
                        │
                        ▼
       ┌──────────────────────────────────┐
       │    PostgreSQL Database           │
       └──────────────────────────────────┘
```

---

## REQUEST FLOW

```
1. Client sends GraphQL Query
   │
   ▼
2. Resolver receives (parent, args, context)
   │
   ▼
3. Resolver calls ServiceFactory with context
   │
   ├─→ factory.getCompanyService()
   │
   ▼
4. Factory creates CompanyService(context)
   │
   ├─→ Service receives context (dataloaders, cache, prisma)
   │
   ▼
5. Service calls business logic
   │
   ├─→ this.validate(data)           // Check values
   ├─→ this.repository.findByName()   // Get existing
   ├─→ this.repository.create(data)   // Insert new
   │
   ▼
6. Repository executes Prisma query
   │
   ├─→ prisma.company.create({ data })
   │
   ▼
7. Database executes, returns data
   │
   ├─→ { id, name, timezone, ... }
   │
   ▼
8. Service validates result & updates cache
   │
   ├─→ this.invalidateAll()
   │
   ▼
9. Resolver receives Company object
   │
   ├─→ Returns to GraphQL
   │
   ▼
10. GraphQL returns JSON to Client
    │
    └─→ { data: { createCompany: { id, name, ... } } }
```

---

## REPOSITORY PATTERN DETAILS

### CompanyRepository (Data Access Layer)

```typescript
class CompanyRepository {
  constructor(private prisma: PrismaClient) {}

  // READ
  async findById(id: string): Promise<Company | null>;
  async findAll(): Promise<Company[]>;
  async findByName(name: string): Promise<Company | null>;

  // CREATE
  async create(data: CompanyCreateInput): Promise<Company>;

  // UPDATE
  async update(id: string, data: CompanyUpdateInput): Promise<Company>;

  // STATS
  async getDepartmentCount(companyId: string): Promise<number>;
  async getEmployeeCount(companyId: string): Promise<number>;
}

// ✅ ONLY handles Prisma calls
// ✅ NO business logic
// ✅ NO validation
// ✅ NO cache management
```

### CompanyService (Business Logic Layer)

```typescript
class CompanyService extends BaseService {
  readonly domain = "company";
  private repository: CompanyRepository;

  async create(data: { name: string; timezone?: string }): Promise<Company> {
    // ✅ Validation
    this.validate(data.name, "Name required");

    // ✅ Check duplicates (uses repository)
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new ValidationError(`Company "${data.name}" already exists`);
    }

    // ✅ Create (uses repository)
    const company = await this.repository.create(data);

    // ✅ Invalidate cache
    this.invalidateAll();

    return company;
  }
}

// ✅ Handles validation
// ✅ Coordinates repositories
// ✅ Manages caching
// ✅ Applies business rules
```

---

## 8 SERVICES AVAILABLE

### Core Domain

1. **CompanyService + CompanyRepository**
   - Company management
   - Working hours configuration
   - Department & employee counts

2. **EmployeeService + EmployeeRepository**
   - Employee CRUD
   - Department assignments
   - Task count tracking

3. **GradeService + GradeRepository**
   - Grade/level management
   - kGrade coefficients
   - Employee distribution by grade

### Operations Domain

4. **ProcessService + ProcessRepository**
   - Process definition
   - Task tracking
   - Process timeline

5. **TaskAssignmentService + TaskAssignmentRepository**
   - Task assignment to employees
   - Status tracking (pending/in_progress/completed)
   - Planned hours tracking

### Analytics Domain

6. **LoadSnapshotService + LoadSnapshotRepository**
   - Capacity snapshots
   - Historical load data

7. **GapAnalysisService + GapAnalysisRepository**
   - Gap analysis results
   - Hiring recommendations

### Audit Domain

8. **EmployeeHistoryService + EmployeeHistoryRepository**
   - Employee change history
   - Immutable audit trail

9. **AuditLogService + AuditLogRepository**
   - System action logging
   - User activity tracking

---

## HOW TO USE IN RESOLVERS

```typescript
// ✅ Create Company
async function createCompany(parent, args, context) {
  const factory = new ServiceFactory(context);
  const service = factory.getCompanyService();

  return service.create({
    name: args.name,
    timezone: args.timezone,
  });
}

// ✅ Get Employee with stats
async function getEmployee(parent, args, context) {
  const factory = new ServiceFactory(context);
  const service = factory.getEmployeeService();

  return service.getWithStats(args.id);
}

// ✅ Update Task Status
async function updateTaskStatus(parent, args, context) {
  const factory = new ServiceFactory(context);
  const service = factory.getTaskAssignmentService();

  return service.updateStatus(args.id, args.status);
}
```

---

## TYPE HIERARCHY

```
ServiceContext (interface)
├── userId: string | null
├── user?: User
├── isAuthenticated: boolean
├── prisma: PrismaClient
├── dataloaders: DataLoaders
├── cache: CacheManager
├── requestId: string
├── timestamp: Date
└── errors: GraphQLError[]

            ↓

IService (interface)
├── invalidate(id: string | number): void
└── readonly domain: string

            ↓

BaseService (abstract class)
├── readonly domain: string
├── protected context: ServiceContext
├── validate(value: any, message: string)
├── validateCondition(condition: boolean, message: string)
├── getOrFetch<T>(key, fetcher, ttl?)
├── ensureExists(entity, name, id)
├── invalidate(id)
├── invalidateAll()
└── log(level, message, data?)

            ↓

Concrete Services
├── CompanyService
├── EmployeeService
├── GradeService
├── ProcessService
├── TaskAssignmentService
├── LoadSnapshotService
├── GapAnalysisService
├── EmployeeHistoryService
└── AuditLogService
```

---

## CACHING STRATEGY

```
Request comes in
    │
    ├─→ Service.getById(id)
    │   │
    │   ├─→ Check cache: cache.get('company:123')
    │   │   │
    │   │   ├─ HIT: Return cached data ✨
    │   │   │
    │   │   └─ MISS: Fetch fresh
    │   │       │
    │   │       ├─→ repository.findById(id)
    │   │       │
    │   │       ├─→ prisma.company.findUnique()
    │   │       │
    │   │       ├─→ Store in cache: cache.set(key, data)
    │   │       │
    │   │       └─→ Return fresh data
    │
    └─→ Service.update(id, data)
        │
        ├─→ repository.update(id, data)
        │
        ├─→ Invalidate specific entry: invalidate(id)
        │   └─ Removes cache['company:123']
        │
        └─→ Invalidate list: invalidateAll()
            └─ Removes cache['list:company:*']
```

---

## ERROR HANDLING

```
throw new ValidationError('Message')
  ├─ Status: 422
  └─ Code: VALIDATION_ERROR

throw new NotFoundError('Company', '123')
  ├─ Status: 404
  └─ Code: NOT_FOUND

throw new ServiceError('Custom message', 'CODE', 500)
  ├─ Status: Custom
  └─ Can be caught in middleware

throw new AuthorizationError('Not authorized')
  ├─ Status: 403
  └─ Code: FORBIDDEN
```

---

## NEXT STEPS

→ Phase 5: Resolver Middleware
├─ Auth extraction (JWT → userId)
├─ Permission verification
├─ Input validation
└─ Error formatting

→ Phase 6: Thin Resolvers
├─ Connect GraphQL types
├─ Wire resolvers to services
└─ Add nested resolvers

---

**Architecture is now clean, organized, and ready to scale!** 🚀
