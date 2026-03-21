# Process CSV Import Integration - Complete ✅

## What Changed

You already had an excellent CSV upload system in place at `/app/api/onboarding/submit/route.ts`. Rather than create a new separate endpoint, we:

1. ✅ **Deleted** the new `/app/api/import/processes/route.ts` (unnecessary duplication)
2. ✅ **Updated** `/server/services/operations/process/ProcessCSVImporter.ts` to use new human-readable fields
3. ✅ **Aligned** ProcessCSVImporter with the DepartmentCSVImporter pattern
4. ✅ **Created** process weight calculator for CU calculations

---

## ProcessCSVImporter: Updated Fields

### From (Old - Removed)

```typescript
interface ProcessImportRow {
  kBurn?: string | number; // technical k-factor
  kCrit?: string | number; // technical k-factor
  kNew?: string | number; // technical k-factor
  priority?: string; // redundant field
}
```

### To (New - Added)

```typescript
interface ProcessImportRow {
  complexity?: string;          // routine|standard|complex|expert
  businessImpact?: string;      // low|medium|high|critical
  newness?: string;             // routine|familiar|new|experimental
  isBurningOut?: string;        // true|false
  [required + optional fields unchanged]
}
```

---

## Onboarding Flow: How It Works

```
User uploads CSV files
          ↓
/app/api/onboarding/submit handles:
  1. Department files
  2. Employee files
  3. Process files ← Uses updated ProcessCSVImporter
          ↓
ProcessCSVImporter:
  - Validates rows with validateProcessRows()
  - Checks complexity enum values
  - Checks businessImpact enum values
  - Checks newness enum values
  - Checks isBurningOut boolean
  - Creates Process records with new fields
          ↓
Processes stored in DB with human-readable fields
```

---

## CSV Format for Processes

Users now provide processes like this:

```csv
title,plannedHours,complexity,businessImpact,newness,isBurningOut,targetGrade,department
Code Review,8,routine,medium,routine,false,Mid-level,Engineering
API Development,20,standard,high,familiar,false,Senior,Engineering
System Refactor,32,complex,high,new,true,Senior,Engineering
Emergency Bug Fix,4,routine,critical,routine,true,Lead,Operations
```

All fields except title/plannedHours/targetGrade/department are optional with defaults:

- complexity: "standard"
- businessImpact: "medium"
- newness: "routine"
- isBurningOut: false

---

## Validation Pattern (Matching DepartmentCSVImporter)

```typescript
// 1. Validate individual row
validateProcessRow(row, requiredFields) → { valid, errors }

// 2. Validate all rows
validateProcessRows(rows, requiredFields) → Array<validation>

// 3. Check overall validity
allProcessRowsValid(validationResults) → boolean

// 4. Extract errors for display
getProcessValidationErrors(validationResults) → indexed errors
```

---

## Services Structure

### Retired (Deleted)

- ❌ `/server/services/imports/process-csv-importer.ts` (duplicate, different pattern)
- ❌ `/app/api/import/processes/route.ts` (separate endpoint, not needed)

### Active (Updated)

- ✅ `/server/services/operations/process/ProcessCSVImporter.ts` (main importer + validator)
- ✅ `/server/services/capacity/process-weight-calculator.ts` (converts complexity → k-factors)

### Existing (Unchanged)

- ✅ `/app/api/onboarding/submit/route.ts` (orchestrates all imports)
- ✅ `/server/services/core/department/DepartmentCSVImporter.ts` (pattern reference)

---

## Data Flow: Import → Store → Calculate

```
CSV Input (Human-Readable)
  complexity: "complex"
  businessImpact: "high"
  newness: "new"
  isBurningOut: true
       ↓
ProcessCSVImporter validation
  ✓ Validates enum values
  ✓ Creates Process record
       ↓
Database Storage
  ✓ Fields stored as-is in Process table
       ↓
On Calculation (When needed)
  process-weight-calculator converts:
  - complexity → kBurn value (0.3) + burnout bonus (0.2) = 0.5
  - businessImpact → kCrit value (0.5)
  - newness → kNew value (0.3)
  - Formula: (32h / 8) × (1 + 0.5 + 0.5 + 0.3) = 4 × 2.3 = 9.2 CU
       ↓
Weight used in analytics
  ✓ Employee load calculation
  ✓ Department utilization
  ✓ Hiring gap analysis
```

---

## Files Modified

| File                                                       | Change                                         |
| ---------------------------------------------------------- | ---------------------------------------------- |
| `server/services/operations/process/ProcessCSVImporter.ts` | Updated interfaces + validation + import logic |
| `server/services/capacity/process-weight-calculator.ts`    | Created (new, non-API utility)                 |
| `app/api/onboarding/submit/route.ts`                       | No changes needed (already correct)            |

---

## Next Steps

1. **Deploy migration**: `npx prisma migrate deploy`
2. **Test onboarding**: Upload CSV with new process fields
3. **Build monthly completion**: Next feature to track task completion data

The system is now unified - single onboarding endpoint handles departments, employees, and processes with a consistent validation pattern.
