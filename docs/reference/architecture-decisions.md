# Repository Pattern & Architecture Decisions

## Overview

This document explains the actual architectural implementation, including how the repository pattern is used, how services are organized, and the design decisions behind the codebase.

---

## We USE the Repository Pattern ✅

The codebase implements a **full repository pattern** across all services for clean separation of concerns between data access and business logic.

### Actual Architecture (Service + Repository)

```
Resolver
  └─ ServiceFactory.getService()
  └─ Service (business logic, validation, caching)
    └─ Repository (data access only)
      └─ Prisma + DataLoaders
```

### Real Implementation

Every service is organized with a repository layer:

```
server/services/
├── core/
│   ├── company/
│   │   ├── Company.repository.ts  ← Data access layer
│   │   ├── Company.service.ts     ← Business logic layer
│   │   └── index.ts               ← Exports
│   ├── employee/
│   │   ├── Employee.repository.ts
│   │   ├── Employee.service.ts
│   │   └── index.ts
│   ├── grade/
│   │   ├── Grade.repository.ts
│   │   ├── Grade.service.ts
│   │   └── index.ts
│   └── department/ (same pattern)
├── operations/
│   ├── process/ (repository + service)
│   └── taskAssignment/ (repository + service)
├── analytics/ (gap analysis, load snapshot)
├── audit/ (employee history, audit logs)
└── base/
    ├── BaseRepository.ts          ← Generic CRUD base class
    ├── BaseService.ts             ← Logic base class
    └── fsm/FiniteStateMachine.ts   ← State validation
```

---

## Why the Repository Pattern Works Here

### ✅ Benefits We Get

1. **Clear Separation** - Repository handles data access, Service handles business logic
2. **Easy Testing** - Mock repositories independently from service logic
3. **Maintainability** - Changes isolated by concern (data vs logic)
4. **Consistency** - All services follow the same pattern
5. **Scalability** - Easy to add new services by copying folder structure
6. **Reusability** - Repository methods available across all related services
7. **FSM Support** - BaseRepository provides Finite State Machine for state validation
8. **Type Safety** - Generic BaseRepository ensures consistent typing

---

## Architecture Layers (3-Layer Pattern)

### Layer 1: GraphQL Resolvers (Thin Orchestration)

```typescript
// Resolvers are THIN - just wire up request to service
export const getEmployee = withMiddleware<GetEmployeeArgs>(
  async (_parent, { id }, context: GraphQLContext) => {
    return context.services.employee.getById(id);
  },
  { requireAuth: true, requiredPermissions: ["employee:read"] },
);

// Responsibilities:
// - Parse GraphQL arguments ✅
// - Call correct service ✅
// - Apply middleware ✅
// - Return properly typed response ✅

// NOT responsible for:
// - Business logic ❌
// - Data access ❌
// - Validation (middleware does it) ❌
```

### Layer 2: Service Layer (Business Logic)

```typescript
export class EmployeeService extends BaseService {
  private repository: EmployeeRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new EmployeeRepository(context.prisma);
  }

  // READ - delegates to repository
  async getById(id: string): Promise<Employee> {
    const cacheKey = this.cacheKey(id);
    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  // BUSINESS LOGIC - stays in service
  async calculateCapacity(id: string): number {
    const emp = await this.repository.findById(id);
    if (!emp) throw new Error("Not found");

    const kGrade = emp.grade.kGrade;
    const kGen = emp.gender === "F" ? 0.7 : 1.0;
    // ... complex calculation
    return monthlyCapacity;
  }

  // CREATE - adds validation + cache management
  async create(data: CreateInput): Promise<Employee> {
    this.validate(data); // Validation
    const existing = await this.repository.findByEmail(data.email);
    if (existing) throw new Error("Email already exists");

    const emp = await this.repository.create(data);
    this.invalidateCache("employees-list"); // Cache invalidation

    return emp;
  }
}

// Responsibilities of Service:
// - Business logic ✅
// - Input validation ✅
// - Cache management ✅
// - Error handling ✅
// - Delegating to repository ✅
```

### Layer 3: Repository Layer (Data Access)

```typescript
export class EmployeeRepository extends BaseRepository<Employee> {
  protected readonly modelName = "employee" as const;

  // Inherited from BaseRepository: findById, findMany, findAll,
  // findWithPagination, create, update, delete, and more

  // Domain-specific queries beyond basic CRUD
  async findByEmail(email: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({ where: { email } });
  }

  async findByDepartment(deptId: string): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { departmentId: deptId },
      include: { grade: true },
    });
  }

  async findWithRelations(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        grade: true,
        department: true,
        taskAssignments: true,
      },
    });
  }
}

// Responsibilities of Repository:
// - All Prisma queries ✅
// - DataLoader integration ✅
// - Type-safe data access ✅
// - Query optimization ✅
// - NO business logic ❌
```

### Layer 4: Data Access (Prisma + DataLoaders)

Underneath the repository, the actual database access:

```typescript
// DataLoaders - Automatic batching
const emp1 = await loaders.employee.load(id1); // Batched
const emp2 = await loaders.employee.load(id2); // Batched
// Result: 1 database query for both ✅

// Prisma Client - Type-safe queries
const emp = await prisma.employee.findUnique({
  where: { id },
  include: { grade: true },
});

// Responsibilities:
// - Database querying ✅
// - Query optimization (batching) ✅
// - Type safety ✅
```

---

## Separation of Concerns

### What Goes WHERE

**In Resolver:**

```typescript
// ✅ DO THIS
- Call service method
- Handle response formatting
- Delegate to middleware

// ❌ DON'T DO THIS
- Business logic (validation, calculations)
- Direct Prisma queries
- Cache management
- Error handling (middleware does it)
```

**In Service:**

```typescript
// ✅ DO THIS
- Business logic (calculations, validation)
- Cache invalidation
- Coordinate data access
- Load-related data

// ❌ DON'T DO THIS
- GraphQL schema details
- HTTP concerns
- Complex raw SQL
```

**In Repository:**

```typescript
// ✅ DO THIS
- All Prisma database queries
- DataLoader integration
- Query optimization
- Complex multi-table queries
- Domain-specific data access patterns

// ❌ DON'T DO THIS
- Business logic
- Cache management
- Service-level validation
- Cross-domain coordination
```

---

## Service Factory Pattern

Services are created via a **Service Factory** - a single entry point for dependency injection.

### Why Factory?

```typescript
// Without factory: complicated constructor
class EmployeeService {
  constructor(prisma: PrismaClient, loaders: DataLoaderRegistry, cache: Cache) {
    // ...
  }
}

// With factory: clean initialization
const factory = new ServiceFactory(context);
const employeeService = factory.getEmployeeService();
```

### Factory Implementation

```typescript
class ServiceFactory {
  // Lazy initialization - create only when needed
  private employeeService?: EmployeeService;

  constructor(private context: ServiceContext) {}

  getEmployeeService(): EmployeeService {
    if (!this.employeeService) {
      this.employeeService = new EmployeeService(this.context);
    }
    return this.employeeService;
  }
}

// Usage in context
const context = {
  services: {
    employee: factory.getEmployeeService(),
    company: factory.getCompanyService(),
    // ...
  },
};
```

---

## Base Service Pattern

All services inherit from `BaseService` for common functionality.

### What BaseService Provides

```typescript
abstract class BaseService {
  // Cache invalidation
  protected invalidateCache(key: string): void {
    this.context.cache.delete(key);
  }

  // Get cache
  protected getCache<T>(key: string): T | null {
    return this.context.cache.get(key);
  }

  // Set cache
  protected setCache<T>(key: string, value: T): void {
    this.context.cache.set(key, value);
  }

  // Logging
  protected log(message: string, data?: any): void {
    console.log(`[${this.constructor.name}] ${message}`, data);
  }

  // Error handling
  protected throwNotFound(id: string): never {
    throw new GraphQLError(`Not found: ${id}`, {
      extensions: { code: "NOT_FOUND" },
    });
  }
}

// Services extend BaseService
class EmployeeService extends BaseService {
  async getById(id: string) {
    // Can use inherited methods
    const cached = this.getCache(`employee-${id}`);
    if (cached) return cached;

    const emp = await this.context.loaders.employee.load(id);

    this.setCache(`employee-${id}`, emp);
    return emp;
  }
}
```

---

## Service Dependencies

### What Services CAN Access

```typescript
class AnyService {
  constructor(private context: ServiceContext) {}

  async doSomething() {
    // Prisma - shared singleton
    this.context.prisma.employee.findUnique(...);

    // DataLoaders - fresh per request
    this.context.loaders.employee.load(...);

    // Cache - request-scoped
    this.context.cache.set(...);

    // Request metadata
    this.context.requestId;
    this.context.userId;

    // Other services (via factory)
    // NOTE: Only call other services if they're composable
  }
}
```

### Service Composition

```typescript
// ✅ GOOD: Service A calls Service B for a sub-task
class DepartmentService {
  async analyze(deptId: string) {
    const dept = await this.getById(deptId);
    const employees = await this.getEmployees(deptId);

    // Use employee service for complex calculation
    const capacities = await Promise.all(
      employees.map((e) =>
        this.context.employeeService.calculateCapacity(e.id),
      ),
    );

    return { dept, employees, capacities };
  }
}

// ❌ BAD: Circular dependencies
class EmployeeService {
  async checkAvailability(empId: string, taskId: string) {
    const task = await this.context.taskService.getById(taskId);
    // Task service might call employee service - CIRCULAR!
  }
}
```

---

## Cache Invalidation Strategy

### When to Invalidate

```typescript
class EmployeeService {
  async create(data: CreateInput): Promise<Employee> {
    const emp = await this.context.prisma.employee.create({ data });

    // Invalidate affected caches
    this.invalidateCache(`employees-list`); // List cache
    this.invalidateCache(`employee-${emp.id}`); // Specific employee
    this.invalidateCache(`dept-${emp.departmentId}-employees`); // Dept cache
    this.invalidateCache(`load-snapshot-${emp.departmentId}`); // Load analysis

    return emp;
  }

  async update(id: string, data: UpdateInput): Promise<Employee> {
    const emp = await this.context.prisma.employee.update({
      where: { id },
      data,
    });

    // Same invalidation strategy
    this.invalidateCache(`employee-${id}`);
    this.invalidateCache(`employees-list`);
    this.invalidateCache(`dept-${emp.departmentId}-employees`);

    return emp;
  }
}
```

---

## Performance Considerations

### Query Count Optimization

Without optimization:

```typescript
// Get 100 employees
const employees = await service.getByDepartment(deptId);
// 1 query: Get employees

// For each employee, get grade
employees.forEach((emp) => {
  const grade = await service.getGrade(emp.gradeId);
  // 100 queries: Get grades (N+1 ❌)
});

// Total: 101 queries ❌
```

With DataLoaders:

```typescript
// Get employees
const employees = await service.getByDepartment(deptId);
// 1 query: Get employees

// Get grades (all batched)
const grades = await Promise.all(
  employees.map((emp) => context.loaders.grade.load(emp.gradeId)),
);
// 1 query: Get all grades (batched ✅)

// Total: 2 queries ✅
```

---

## Testing Strategy

### Unit Test Services

```typescript
// Mock context dependencies
const mockContext = {
  prisma: {
    employee: { findUnique: jest.fn() },
  },
  loaders: {
    employee: { load: jest.fn() },
  },
  cache: new Map(),
};

// Create service
const service = new EmployeeService(mockContext);

// Test
it("should get employee by id", async () => {
  const employee = { id: "1", fio: "John" };
  mockContext.loaders.employee.load.mockResolvedValue(employee);

  const result = await service.getById("1");

  expect(result).toEqual(employee);
  expect(mockContext.loaders.employee.load).toHaveBeenCalledWith("1");
});
```

---

## Related Documentation

- [Services Layer](./docs/server/services/README.md)
- [DataLoaders](./docs/server/services/dataloaders.md)
- [System Architecture](./docs/system/README.md)
- [Quick Reference](./docs/reference/quick-reference.md)
