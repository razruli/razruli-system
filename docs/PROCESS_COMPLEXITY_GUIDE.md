# Process Data Model: Human-Readable Complexity

## Overview

The Process table now uses **human-readable categories** instead of technical k-factors. This makes it easy for non-technical users to describe the complexity of work.

At import/calculation time, these categories are automatically converted to k-factors using predefined mappings.

---

## Field Mappings

### 1. Complexity (Task Difficulty)

Describes the technical difficulty and skill level required to complete the work.

| Value        | Grade     | Description                       | kBurn Value | When to Use                                                   |
| ------------ | --------- | --------------------------------- | ----------- | ------------------------------------------------------------- |
| **routine**  | Junior    | Simple, repetitive task           | 0.0         | Code reviews, standard testing, routine maintenance           |
| **standard** | Mid-level | Normal feature work               | 0.1         | Feature development, API endpoints, standard integrations     |
| **complex**  | Senior    | Architectural work, system design | 0.3         | Database migrations, system refactoring, architecture changes |
| **expert**   | Lead+     | Bleeding-edge, high uncertainty   | 0.5         | R&D, new frameworks, experimental features, POCs              |

### 2. Business Impact (Customer/Revenue Impact)

Describes how important the work is to business operations and customers.

| Value        | Description                 | kCrit Value | When to Use                                                         |
| ------------ | --------------------------- | ----------- | ------------------------------------------------------------------- |
| **low**      | Nice to have, can wait      | 0.0         | Documentation, tech debt cleanup, "would be nice" improvements      |
| **medium**   | Normal business operations  | 0.1         | Standard features, regular maintenance, non-urgent fixes            |
| **high**     | Important deliverable       | 0.5         | Key feature release, important improvement, department-level impact |
| **critical** | System down, revenue impact | 1.0         | Production outage, customer-affecting bug, system unavailable       |

### 3. Newness (Learning Curve)

Describes how new/unfamiliar the work is to your team.

| Value            | Description                              | kNew Value | When to Use                                                      |
| ---------------- | ---------------------------------------- | ---------- | ---------------------------------------------------------------- |
| **routine**      | Done before, well-known                  | 0.0        | Repeated tasks, proven patterns, established workflows           |
| **familiar**     | Similar to past work, minor learning     | 0.1        | Same framework/language, similar patterns, minor new library     |
| **new**          | New framework/tool, significant learning | 0.3        | New programming language, new database, new architecture pattern |
| **experimental** | Cutting-edge, high uncertainty           | 0.5        | Emerging tech, unproven patterns, bleeding-edge tools            |

### 4. isBurningOut (Mental Exhaustion Flag)

Optional boolean flag for work that's mentally exhausting (adds 0.2 to burnout factor).

| Value     | Description         | Additional kBurn | When to Use                                                              |
| --------- | ------------------- | ---------------- | ------------------------------------------------------------------------ |
| **false** | Normal work         | 0.0              | Most tasks                                                               |
| **true**  | Mentally exhausting | +0.2             | On-call, crisis response, high-stress debugging, large-scale refactoring |

---

## Weight Calculation

Final weight = (plannedHours / 8) × (1 + kBurn + kCrit + kNew)

### Example 1: Simple Code Review

```
Title: "Code Review"
plannedHours: 8
complexity: routine         → kBurn = 0.0
businessImpact: medium      → kCrit = 0.1
newness: routine            → kNew = 0.0
isBurningOut: false         → no bonus

Weight = (8/8) × (1 + 0.0 + 0.1 + 0.0) = 1 × 1.1 = 1.1 CU
```

### Example 2: Complex Feature with New Tech

```
Title: "Build new microservice with Rust"
plannedHours: 40
complexity: complex         → kBurn = 0.3
businessImpact: high        → kCrit = 0.5
newness: new                → kNew = 0.3
isBurningOut: true          → bonus = 0.2

Total kBurn = 0.3 + 0.2 = 0.5
Weight = (40/8) × (1 + 0.5 + 0.5 + 0.3) = 5 × 2.3 = 11.5 CU
```

### Example 3: Critical Production Emergency

```
Title: "Database emergency - replication down"
plannedHours: 4
complexity: routine         → kBurn = 0.0
businessImpact: critical    → kCrit = 1.0
newness: routine            → kNew = 0.0
isBurningOut: true          → bonus = 0.2

Total kBurn = 0.0 + 0.2 = 0.2
Weight = (4/8) × (1 + 0.2 + 1.0 + 0.0) = 0.5 × 2.2 = 1.1 CU
Even though it's only 4 hours, criticality and stress make it 1.1 CU
```

---

## CSV Import Format

### Required Columns

- `departmentId` - UUID of owning department
- `title` - Process/task name
- `plannedHours` - Hours estimate (number)
- `complexity` - routine|standard|complex|expert
- `businessImpact` - low|medium|high|critical
- `newness` - routine|familiar|new|experimental
- `targetGradeId` - Grade ID (1-7)

### Optional Columns

- `processId` - For updating existing processes (empty = create new)
- `description` - Detailed description
- `isBurningOut` - true|false (default: false)

### Example CSV

```csv
processId,departmentId,title,description,plannedHours,complexity,businessImpact,newness,isBurningOut,targetGradeId
,dept_eng_001,Code Review,Standard 4-eye review of PRs,8,routine,medium,routine,false,2
,dept_eng_001,Feature: Payment API,Build new payment webhook integration,20,standard,high,familiar,false,3
,dept_eng_001,Refactor Database Layer,Architecture improvement for scalability,32,complex,high,new,true,3
,dept_eng_001,Emergency: Database Failover,Production emergency - replication failed,4,routine,critical,routine,true,4
,dept_ops_001,Server Provisioning,Set up new application server,12,standard,medium,familiar,false,1
,dept_ml_001,Research: LLM Fine-tuning,POC for custom model fine-tuning,40,expert,low,experimental,true,5
```

---

## Import API

### Endpoint

```
POST /api/import/processes
```

### Request Body

```json
{
  "companyId": "comp_12345",
  "csvContent": "processId,departmentId,title,...\n,dept_001,Code Review,..."
}
```

### Response

```json
{
  "success": true,
  "processesCreated": 5,
  "processesUpdated": 2,
  "errors": [],
  "warnings": [],
  "message": "Processes imported successfully"
}
```

### Helper Endpoints

```
# Download CSV template
GET /api/import/processes?action=template

# Get documentation
GET /api/import/processes?action=help
```

---

## Implementation: Server-Side Conversion

When processes are calculated/analyzed, k-factors are automatically derived:

```typescript
import { calculateProcessWeight } from "@/server/services/capacity/process-weight-calculator";

const process = await prisma.process.findUnique({ where: { id: "proc_123" } });
const { weight, kFactors, breakdown } = calculateProcessWeight(process);

console.log(`Process "${process.title}"`);
console.log(`Weight: ${weight.toFixed(2)} CU`);
console.log(`Breakdown:`);
console.log(`  kBurn: ${kFactors.kBurn} (complexity + stress)`);
console.log(`  kCrit: ${kFactors.kCrit} (business impact)`);
console.log(`  kNew: ${kFactors.kNew} (learning curve)`);
```

---

## Frequently Asked Questions

### Q: Can I have negative k-factors?

A: No. All values are >= 0. Even "simple" work has k-factors of 0.

### Q: Why add 0.2 for burnout instead of increasing complexity?

A: They track different things:

- **complexity** = technical difficulty
- **isBurningOut** = psychological/emotional strain

A task can be technically easy (routine code review) but emotionally draining (reading 5000 lines of changes).

### Q: What if actualGrade ≠ targetGrade?

A: The weight gets adjusted:

- **Junior doing Senior work** → 2x the weight (slower, harder)
- **Senior doing Junior work** → 0.5x the weight (faster, easier)

This is handled in the monthly utilization calculation.

### Q: Can I import partial data?

A: Yes. Required fields only:

- departmentId, title, plannedHours, complexity, businessImpact, newness, targetGradeId
- Optional: processId, description, isBurningOut

### Q: How do I update existing processes?

A: Include the `processId` in CSV. If empty/missing, creates new.

---

## Validation Rules

All CSV imports are validated before import:

1. **departmentId**: Must exist in database
2. **title**: Non-empty string
3. **plannedHours**: Positive number (1-1000)
4. **complexity**: Must be routine|standard|complex|expert
5. **businessImpact**: Must be low|medium|high|critical
6. **newness**: Must be routine|familiar|new|experimental
7. **isBurningOut**: "true" or "false" (case-insensitive)
8. **targetGradeId**: Must exist in Grade table

---

## Migration & Existing Data

⚠️ **Migration Path**: If you have existing processes with k-factors:

The migration will:

1. Drop old kBurn, kCrit, kNew columns
2. Add new complexity, businessImpact, newness columns with defaults
3. **All existing processes** will get default values:
   - complexity: "standard"
   - businessImpact: "medium"
   - newness: "routine"
   - isBurningOut: false

**Action Required**: Review and update the default-assigned processes to match reality.
