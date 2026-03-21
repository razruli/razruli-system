# Complete Onboarding Test Guide

## Available Test CSV Files

### 1. Companies

- **minimal**: `test-companies.csv` - 5 sample companies with industry and timezone

### 2. Departments

- **minimal**: `test-departments-minimal.csv` - 10 departments (name only)
- **full**: `test-departments-full.csv` - 10 departments (with descriptions)

### 3. Roles

- **minimal**: `test-roles-minimal.csv` - 10 job titles/roles

### 4. Employees

- **minimal**: `test-employees-minimal.csv` - 3 employees with required fields only
  - Fields: ФИО, Дата найма, Отдел, Грейд, Тип занятости, Статус
- **full**: `test-employees-full.csv` - 5 employees with all fields
  - Fields: ФИО, Дата найма, Отдел, Грейд, Тип занятости, Статус, Пол, Дата рождения, Часы работы, Эффективность

hoursSpent: true,### 5. Processes

- **minimal**: `test-processes-minimal.csv` - 6 processes with all fields
  - Fields: title, plannedHours, targetGrade, department, complexity, businessImpact, newness, isBurningOut

### 6. Finished Tasks (Analytics Data) ✨

**Test Dataset (Russian departments from test files):**

- **minimal**: `test-finished-tasks-minimal.csv` - 3 task records with required fields only
- **full**: `test-finished-tasks-full.csv` - 5 task records with optional fields

**Production Dataset (English departments from production files):**

- **minimal**: `finished-tasks.csv` - 3 task records with required fields only
- **full**: `finished-tasks-full.csv` - 9 task records with optional fields including employee assignments

---

## Test Scenarios

### Scenario 1: Employee-Only Upload (Minimal) ✅ TESTED

**Steps:**

1. Setup test infrastructure:

   ```bash
   curl -X POST http://localhost:3000/api/setup/cleanup
   ```

2. Run test:
   ```bash
   bash test-data/test-onboarding.sh
   ```

**Expected Result:** 3 employees created successfully

---

### Scenario 2: Employee-Only Upload (Full) 🔄 READY

**CSV File:** `test-employees-full.csv`

- 5 employees with optional fields (gender, birthDate, etc.)

**Column Mapping:**

```json
{
  "ФИО": "fio",
  "Дата найма": "hireDate",
  "Отдел": "department",
  "Грейд": "grade",
  "Тип занятости": "employmentType",
  "Статус": "status",
  "Пол": "gender",
  "Дата рождения": "birthDate",
  "Часы работы": "workingHoursPerDay",
  "Эффективность": "kEfficiency"
}
```

---

### Scenario 3: Departments + Employees 🔄 REQUIRES API UPDATE

**CSV Files:**

- `test-departments-minimal.csv` (departments)
- `test-employees-minimal.csv` (employees using those departments)

**Process:**

1. Upload departments first
2. Then upload employees

---

### Scenario 4: Departments + Roles + Employees 🔄 REQUIRES API UPDATE

**CSV Files:**

- `test-departments-full.csv`
- `test-roles-minimal.csv`
- `test-employees-full.csv`

---

### Scenario 5: Complete Onboarding Flow with Analytics ✨ NEW

**CSV Files (Recommended Order):**

1. `test-departments-full.csv` (business structure)
2. `test-processes-minimal.csv` (operations framework)
3. `test-employees-full.csv` (headcount)
4. `test-finished-tasks-full.csv` (historical analytics)

**Why This Order:**

- Departments first → needed for processes and employees
- Processes next → needed for finished tasks reference
- Employees next → can reference finished tasks via names (Иван Петров, Алексей Иванов, Мария Сидорова, Елена Смирнова)
- Finished tasks last → all dependencies exist

**Expected Result:**

- Dashboard displays meaningful analytics data
- All metrics and charts show real data, not mocks
- Company ready for immediate use

### Scenario 6: Production Onboarding Flow with Full Analytics ✨ NEW

**CSV Files (Recommended Order):**

1. `departments.csv` (business structure - English departments)
2. `processes.csv` (8 complete processes with burn/crit/new factors)
3. `employees.csv` (8 employees with full details and efficiency multipliers)
4. `finished-tasks-full.csv` (9 historical task records with employee assignments)

**Expected Result:**

- Complete production-ready setup
- Rich analytics with multiple employees and departments
- All capacity calculations and metrics populated
- Dashboard shows comprehensive business operations data

### Scenario 7: Companies from CSV 🔄 REQUIRES API UPDATE

**CSV File:** `test-companies.csv`

- Instead of manually entering company in form
- Upload CSV with multiple companies
- Onboarding flow matches employees to company by name

---

## GUI Testing (Current Implementation)

### Steps to Test in Browser:

1. **Setup Infrastructure:**

   ```bash
   curl -X POST http://localhost:3000/api/setup/cleanup
   ```

2. **Open Onboarding Flow:**
   - Navigate to onboarding page

3. **Step 1 - Company:**
   - Enter: `Test Company 2026-03-15`
   - Enter timezone: `UTC+3`

4. **Step 2 - Role:**
   - Enter: `Senior Developer`

5. **Step 3 - Upload:**
   - Select: `test-employees-minimal.csv`

6. **Step 4 - Mapping:**
   - Map headers:
     - ФИО → fio
     - Дата найма → hireDate
     - Отдел → department
     - Грейд → grade
     - Тип занятости → employmentType
     - Статус → status

7. **Step 5 - Confirmation:**
   - Review information
   - Check checkbox
   - Click "Complete Setup"

**Expected Result:** ✅ Redirects to dashboard, 3 employees created

---

## What the API Does Now

### Current Implementation (Auto-Creates Departments)

When you submit employees CSV:

1. Looks for company by name
2. If company doesn't exist → **creates it**
3. Looks for required departments in company
4. If departments don't exist → **auto-creates them** ✨ (NEW)
5. Validates all employee rows
6. Creates employees in atomic transaction

### What Still Needs Implementation

To support **departments, roles, and companies CSV uploads**, the API needs:

1. **File Type Detection**
   - Determine if CSV is for employees, departments, roles, or companies
   - Could be based on file name convention: `departments_*.csv`, `roles_*.csv`, etc.
   - Or could be a form field: `fileType: "employee" | "department" | "role" | "company"`

2. **Department CSV Processing**
   - Validate department names are unique per company
   - Create departments in bulk

3. **Role CSV Processing**
   - Roles are stored in system but currently just informational in onboarding
   - Could store in database if needed

4. **Company CSV Processing**
   - Create companies from CSV
   - Map employees to companies by name

5. **Multi-File Orchestration**
   - Process order: companies → departments → roles → employees
   - Ensure references exist before batch inserts

---

## Test Commands

### View Current Database State

```bash
curl http://localhost:3000/api/debug/state | jq '.'
```

### Clean and Setup Test Data

```bash
curl -X POST http://localhost:3000/api/setup/cleanup | jq '.'
```

### Test Employee CSV (Minimal)

```bash
bash test-data/test-onboarding.sh
```

---

## CSV Format Examples

### Departments CSV

```
Название
Разработка
Дизайн
Продажи
```

### Roles CSV

```
Название
Junior Developer
Senior Developer
Product Manager
```

### Employees CSV (Minimal)

```
ФИО,Дата найма,Отдел,Грейд,Тип занятости,Статус
Иван Петров,2024-01-15,Разработка,Junior,ТД,active
Мария Сидорова,2024-02-20,Дизайн,Junior,ТД,active
```

### Employees CSV (Full)

```
ФИО,Дата найма,Отдел,Грейд,Тип занятости,Статус,Пол,Дата рождения,Часы работы,Эффективность
Иван Петров,2024-01-15,Разработка,Junior,ТД,active,М,1995-05-20,8,1.0
Мария Сидорова,2024-02-20,Дизайн,Junior,ТД,active,Ж,1998-07-15,8,0.95
```

### Finished Tasks CSV (Minimal)

```
department,process_name,quantity
Разработка,Code Review,5
Разработка,API Development,3
Дизайн,UI Design,2
```

### Finished Tasks CSV (Full)

```
department,process_name,quantity,employee_name,hoursSpent,status,completedAt,notes
Разработка,Code Review,5,Иван Петров,8,COMPLETED,2026-03-10,Sprint review completed
Разработка,API Development,3,Алексей Иванов,12,COMPLETED,2026-03-12,RESTful API endpoint implemented
Разработка,Database Migration,2,Иван Петров,4,COMPLETED,2026-03-13,Legacy DB migration started
Дизайн,UI Design,2,Мария Сидорова,6,COMPLETED,2026-03-11,Dashboard redesign
Продажи,Customer Demos,4,Елена Смирнова,2,COMPLETED,2026-03-14,3 successful demos with prospects
```

**Finished Tasks Field Reference:**

- **department** (required): Must exist in company
- **process_name** (required): Must match a process title in the company
- **quantity** (required): Positive integer - number of tasks completed
- **employee_name** (optional): "FirstName LastName" format - must exist in department
- **hoursSpent** (optional): Non-negative float - actual hours spent on tasks
- **status** (optional): COMPLETED (default), PENDING, etc.
- **completedAt** (optional): YYYY-MM-DD format - defaults to today
- **notes** (optional): Free-form text field

### Finished Tasks CSV (Production Data - Minimal)

```
department,process_name,quantity
Marketing,Q1 Marketing Campaign,8
Development,API Development Sprint,5
Sales,Customer Onboarding,3
```

### Finished Tasks CSV (Production Data - Full)

```
department,process_name,quantity,employee_name,hoursSpent,status,completedAt,notes
Marketing,Q1 Marketing Campaign,8,Natalia Smirnova,24,COMPLETED,2026-03-10,Q1 campaign execution completed
Marketing,Q1 Marketing Campaign,2,Ivan Petrov,6,COMPLETED,2026-03-11,Social media content created
Development,API Development Sprint,5,Dmitry Sokolov,40,COMPLETED,2026-03-12,Core API endpoints implemented
Development,Database Migration,3,Dmitry Sokolov,12,COMPLETED,2026-03-13,Database migration in progress
Development,Performance Optimization,4,Sergey Lebedev,16,COMPLETED,2026-03-14,Query optimization completed
Sales,Customer Onboarding,3,Anna Volkova,8,COMPLETED,2026-03-10,3 new customers onboarded
Sales,Monthly Sales Report,2,Pavel Orlov,4,COMPLETED,2026-03-15,Sales metrics analyzed
Support,Support Ticket Review,6,,3,COMPLETED,2026-03-14,Ticket backlog reviewed and prioritized
Operations,Annual Budget Review,1,Mikhail Novikov,4,COMPLETED,2026-03-12,Budget allocation reviewed
```

---

## Validation Rules

### Employees

- ✅ FIO (full name) - required, non-empty string
- ✅ Hire Date - required, format YYYY-MM-DD
- ✅ Department - required, must exist in company
- ✅ Grade - required, must exist in system
- ✅ Employment Type - required, one of: ТД, ГПХ, Самозанятый
- ✅ Status - required, one of: active, inactive
- ✅ Gender - optional, format: М or Ж
- ✅ Birth Date - optional, format YYYY-MM-DD
- ✅ Working Hours - optional, 1-24
- ✅ Efficiency - optional, 0.1-2.0 (float)

### Departments

- ✅ Name - required, unique per company

### Roles

- ✅ Name - required, unique in system

### Companies

- ✅ Name - required, unique
- ✅ Timezone - optional, defaults to UTC+3
- ✅ Working Hours - optional, defaults to 8
- ✅ Industry - optional

---

## Current Status

| Component                | Status             | Notes                                |
| ------------------------ | ------------------ | ------------------------------------ |
| Employee Upload          | ✅ Working         | Both minimal and full CSVs           |
| Auto-Department Creation | ✅ Working         | Departments created on-demand        |
| GUI Onboarding Flow      | ✅ Working         | Can complete 5-step wizard           |
| Department CSV Upload    | ⏳ Not implemented | Files created, API needs update      |
| Role CSV Upload          | ⏳ Not implemented | Files created, API needs update      |
| Company CSV Upload       | ⏳ Not implemented | Files created, API needs update      |
| Multi-File Orchestration | ⏳ Not implemented | Would need to handle file order/deps |
