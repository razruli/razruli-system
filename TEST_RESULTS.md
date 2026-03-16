# Onboarding Flow Test Results & GUI Failure Analysis

## Summary

**✅ API Test: PASSED** - The backend API works correctly and processes CSV files
**❌ GUI Confirmation: LIKELY FAILS** - Due to missing department setup for new companies

---

## Root Cause of GUI Confirmation Failure

When you use the GUI to complete onboarding:

1. **Company Form**: You enter company name (e.g., "My Company")
2. **CSV Upload**: You pick a file (e.g., with dept "Разработка")
3. **Mapping**: You map headers to database fields
4. **Confirmation**: You click "Complete Setup" → **FAILS**

### Why It Fails

The API does:

```typescript
// Line 56-69 in /app/api/onboarding/submit/route.ts
let company = await prisma.company.findFirst({
  where: { name: companyData.name },
});

if (!company) {
  company = await prisma.company.create({  // Creates NEW company
    data: { name: companyData.name, ... },
  });
}

// Then later (line 139-148)...
const departments = await prisma.department.findMany({
  where: {
    companyId: company.id,  // ← Looks for departments in the NEW company
    name: { in: departmentNames },
  },
});
```

**The problem**: When a NEW company is created, it has ZERO departments. When the API looks for departments like "Разработка", they don't exist → **Error: "Departments not found"**

---

## Test Results

### Test 1: Minimal CSV (3 Employees, Required Fields Only) ✅ PASSED

**CSV Headers:**

```
ФИО, Дата найма, Отдел, Грейд, Тип занятости, Статус
```

**Test Data:**

```
Иван Петров,2024-01-15,Разработка,Junior,ТД,active
Мария Сидорова,2024-02-20,Дизайн,Junior,ТД,active
Алексей Иванов,2024-03-10,Разработка,Junior,ТД,active
```

**Result:** ✅ **200 OK** - 3 employees created

```json
{
  "success": true,
  "employees": { "created": 3 }
}
```

### Test 2: Full CSV (5 Employees, With Optional Fields) ⏳ PENDING

**CSV Headers:**

```
ФИО, Дата найма, Отдел, Грейд, Тип занятости, Статус, Пол, Дата рождения, Часы работы, Эффективность
```

**Test Data:**

```
All 5 employees with gender, birth dates, working hours, efficiency coefficients
```

**Expected Result:** Should pass all validations if departments exist

---

## API Validation Checks (Server-Side)

The API validates each CSV row before inserting:

1. ✅ **Required fields present** (fio, hireDate, department, grade, employmentType, status)
2. ✅ **Data types correct** (dates are YYYY-MM-DD format, numbers are parseable)
3. ✅ **Department exists** in the company
4. ✅ **Grade exists** in the database
5. ✅ **Employment type valid** (ТД, ГПХ, Самозанятый)
6. ✅ **Status valid** (active, inactive)
7. ✅ **No duplicate employees** (unique constraint: companyId + fio)

---

## Solutions to Fix GUI Confirmation

### Solution 1: Pre-create Departments (Recommended)

Departments must exist BEFORE submitting the form. Create them via:

```bash
curl -X POST http://localhost:3000/api/setup/cleanup
```

This sets up:

- **Company**: "Test Company 2026-03-15" (or call setup endpoint)
- **Departments**: Разработка, Дизайн, Продажи, Маркетинг, HR
- **Grades**: Junior, Middle, Senior, Lead, C-level

Then use the SAME company name in the GUI form.

### Solution 2: Auto-Create Departments in GUI

Modify the API to scan CSV, find needed departments, and auto-create them:

```typescript
// In /app/api/onboarding/submit/route.ts
const missingDepartments = departmentNames.filter(
  (name) => !departmentMap.has(name),
);

// Instead of erroring, auto-create:
for (const deptName of missingDepartments) {
  await prisma.department.create({
    data: { companyId: company.id, name: deptName },
  });
}
```

### Solution 3: Pre-fill Company Selector

Add a step before "Role" to:

1. Show existing companies
2. OR create new company with auto-populated departments

---

## Test Data Files Created

1. **test-employees-minimal.csv** - 3 employees, required fields only
   - Location: `/test-data/test-employees-minimal.csv`
   - Status: ✅ Ready, tested, working

2. **test-employees-full.csv** - 5 employees, all fields including optional
   - Location: `/test-data/test-employees-full.csv`
   - Status: ✅ Created, ready to test

3. **setup-test-data.ts** - Script to populate test database
   - Location: `/test-data/setup-test-data.ts`
   - Status: ⚠️ Needs environment variables properly set

4. **test-onboarding.sh** - Bash test runner for API testing
   - Location: `/test-data/test-onboarding.sh`
   - Status: ✅ Working, used for validation

---

## API Endpoints Created for Testing

| Endpoint                 | Method | Purpose                            |
| ------------------------ | ------ | ---------------------------------- |
| `/api/onboarding/submit` | POST   | Main onboarding submission         |
| `/api/setup/cleanup`     | POST   | Clean up and setup fresh test data |
| `/api/setup/test-data`   | POST   | Create test infrastructure         |
| `/api/debug/state`       | GET    | Show current database state        |

---

## Next Steps to Test Fully

1. Run the cleanup endpoint to setup fresh test data
2. In the GUI, enter:
   - **Company**: "Test Company 2026-03-15" (exact name from setup)
   - **Role**: Any role name
   - **File**: test-employees-minimal.csv
3. Map headers in the mapping step
4. Click "Complete Setup"
5. ✅ Should succeed!

---

## Error Messages & Meanings

| Error                                  | Cause                                   | Fix                                        |
| -------------------------------------- | --------------------------------------- | ------------------------------------------ |
| "Departments not found: Разработка"    | Department doesn't exist in the company | Create department first, or use Solution 2 |
| "Grades not found: Junior"             | Grade ID doesn't exist in database      | Run setup endpoint to create grades        |
| "Employee already exists: Иван Петров" | Duplicate fio in same company           | Use unique names or different company      |
| "Invalid hire date format: 01/15/2024" | Wrong date format                       | Use YYYY-MM-DD format                      |
| "Invalid employment type: Contract"    | Wrong employment type value             | Use ТД, ГПХ, or Самозанятый                |
