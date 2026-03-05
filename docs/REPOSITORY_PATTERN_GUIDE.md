# Repository Pattern: Decision Guide

## Your Question: Should Each Service Have a Separate Repository File?

**Short Answer**: Not required now, but you have options. Let me show all 3 patterns.

---

## Pattern 1: Current (Service Handles Everything)

```
server/services/
├── core/
│   ├── CompanyService.ts          ← Both CRUD + business logic
│   ├── EmployeeService.ts         ← Query + calculations in one file
│   └── GradeService.ts            ← Simple operations
└── base/
    └── BaseService.ts             ← Shared utilities
```

**Inside EmployeeService.ts**:

```typescript
export class EmployeeService extends BaseService {
  // Data access (simple)
  async getById(id: string) {
    return this.context.dataloaders.employee.load(id);
  }

  // Data access (query collection)
  async getByDepartment(deptId: string) {
    return this.context.prisma.employee.findMany({
      where: { departmentId: deptId }
    });
  }

  // Business logic (calculation)
  async calculateCapacity(id: string) {
    const emp = await this.getById(id);
    const grade = await this.context.dataloaders.grade.load(emp.gradeId);
    return (grade.kGrade * emp.kEfficiency) * 21;  ← Math here
  }
}
```

**Pros**:

- ✅ Simple, can get started quickly
- ✅ Single file per domain concept
- ✅ No abstraction overhead

**Cons**:

- ❌ If service grows to 500+ lines, hard to navigate
- ❌ Harder to swap Prisma for REST API later
- ❌ Business logic mixed with data access

---

## Pattern 2: Service + Repository (Separated)

```
server/services/core/
├── employee/
│   ├── EmployeeService.ts         ← Business logic only
│   ├── EmployeeRepository.ts      ← Data access only
│   └── index.ts                   ← Exports
```

**EmployeeRepository.ts** (Data access):

```typescript
export class EmployeeRepository {
  constructor(private context: ServiceContext) {}

  async findById(id: string) {
    return this.context.dataloaders.employee.load(id);
  }

  async findByDepartment(deptId: string) {
    return this.context.prisma.employee.findMany({
      where: { departmentId: deptId },
    });
  }

  async findWithRelations(id: string) {
    return this.context.prisma.employee.findUnique({
      where: { id },
      include: { grade: true, department: true },
    });
  }

  async updateGrade(id: string, newGradeId: number) {
    return this.context.prisma.employee.update({
      where: { id },
      data: { gradeId: newGradeId },
    });
  }
}
```

**EmployeeService.ts** (Business logic):

```typescript
export class EmployeeService extends BaseService {
  private repository: EmployeeRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new EmployeeRepository(context);
    // ↑ Repository gets same context
  }

  // Business logic uses repository
  async calculateCapacity(id: string) {
    const emp = await this.repository.findById(id);
    const grade = await this.context.dataloaders.grade.load(emp.gradeId);

    const pDay = 1.0 * grade.kGrade * emp.kEfficiency;
    const pMonth = pDay * 21;
    return pMonth;
  }

  // Complex workflow
  async assignWithCapacityCheck(processId, empId) {
    const emp = await this.repository.findById(empId);
    const process = await this.context.dataloaders.process.load(processId);

    // Business logic
    const result = await this.calculateLoad(process, emp);

    // Use repository for mutations
    if (!overloaded) {
      return await this.repository.createTaskAssignment(empId, processId);
    }

    throw new ValidationError("Employee overloaded");
  }
}
```

**Pros**:

- ✅ Clear separation of concerns
- ✅ Easy to find "where is the EmployeeRepository"
- ✅ Can mock repository separately for unit tests
- ✅ Easy to swap Prisma for REST API (just change repository)

**Cons**:

- ❌ More boilerplate (need both files per service)
- ❌ Repository → Service → Resolver adds layers
- ❌ For simple CRUD, feels over-engineered

---

## Pattern 3: Hybrid (Best of Both)

**Use Simple Service for basic CRUD, Repository for complex logic**

```
server/services/core/
├── CompanyService.ts              ← Simple: no repository needed
├── employee/
│   ├── EmployeeService.ts         ← Complex: has repository
│   ├── EmployeeRepository.ts      ← Handles queries
│   └── index.ts
└── grade/
    └── GradeService.ts            ← Simple: no repository needed
```

```typescript
// Simple services (no repo)
export class CompanyService extends BaseService {
  async getById(id: string) {
    return this.context.dataloaders.company.load(id);  ← One-liner
  }

  async create(data) {
    return this.context.prisma.company.create({ data });
  }
}

// Complex services (with repo)
export class EmployeeService extends BaseService {
  private repository = new EmployeeRepository(this.context);

  async calculateCapacity(id: string) {  ← Business logic
    const emp = await this.repository.findById(id);
    // Calculate...
    return capacity;
  }
}
```

**Pros**:

- ✅ Not over-engineered for simple services
- ✅ Separation where it matters (complex logic)
- ✅ Pragmatic approach

**Cons**:

- ❌ Inconsistent patterns (some with repo, some without)

---

## My Recommendation for Your Project

### **Use Pattern 1 (Current): Service Handles Everything**

**Why?**

1. **Service files aren't huge** - EmployeeService is 300 lines max
2. **Prisma abstracts data access** - We're not using raw SQL, so changing DB is rare
3. **You can refactor later** - Easy to extract Repository later if needed
4. **Collocative** - Logic and data access together makes sense for domain-driven design

### When to Add Repositories

Add repositories WHEN:

- A service file exceeds 400-500 lines
- You have complex Prisma queries (subqueries, joins, aggregations)
- Team wants strict separation of concerns
- You want to mock data access in unit tests

**For now**: Keep current structure. **Focus on Phase 5 (Middleware) and Phase 6 (Resolvers)**.

---

## File Structure Comparison

### Current (Pattern 1) - Recommended

```
server/services/
├── core/
│   ├── CompanyService.ts          (94 lines)
│   ├── EmployeeService.ts         (312 lines)   ← Will grow, but OK
│   ├── GradeService.ts            (107 lines)
│   └── index.ts
├── operations/
│   ├── ProcessService.ts          (209 lines)
│   ├── TaskAssignmentService.ts   (279 lines)
│   └── index.ts
├── analytics/
│   ├── LoadSnapshotService.ts     (322 lines)
│   ├── GapAnalysisService.ts      (282 lines)
│   └── index.ts
├── audit/
│   ├── EmployeeHistoryService.ts  (322 lines)
│   ├── AuditLogService.ts         (356 lines)
│   └── index.ts
├── base/
│   ├── BaseService.ts
│   ├── types.ts
│   └── index.ts
└── ServiceFactory.ts
```

### If You Added Repositories (Pattern 2)

```
server/services/
├── core/
│   ├── company/
│   │   ├── CompanyService.ts
│   │   ├── CompanyRepository.ts   ← More files!
│   │   └── index.ts
│   ├── employee/
│   │   ├── EmployeeService.ts
│   │   ├── EmployeeRepository.ts  ← More files!
│   │   └── index.ts
│   └── grade/
│       ├── GradeService.ts
│       ├── GradeRepository.ts     ← More files!
│       └── index.ts
└── ...
```

**Which is better?** Pattern 1 for now. Pattern 2 when services justify it.

---

## Action Items

1. ✅ Fixed codegen.ts with mappers
2. ✅ Created ARCHITECTURE_FLOW_DETAILED.md (explains everything)
3. ✅ Keep current service structure (Pattern 1)
4. → Phase 5: Create middleware layer
5. → Phase 6: Create thin resolvers

**No refactoring needed right now!**
