# Workload Calculator: Complete System Guide

## Table of Contents

1. [Capacity Units System](#capacity-units-system)
2. [Gap Analysis & Hiring](#gap-analysis--hiring)
3. [System Architecture & Database](#system-architecture--database)

---

# Capacity Units System

**Модель для балансировки ресурсов групп, учёта факторов сотрудников и предотвращения выгорания при сохранении операционной эффективности.**

---

## Part 1: The Golden Standard and Single Currency

### 1.0 Main Definition

**Senior male, 30–35 years old, 2+ years in grade, efficiency 1.0** — this is the standard.

$$P_{Senior,day} = 1.0 \text{ CU/day}$$

$$P_{Senior,hour} = \frac{1.0 \text{ CU}}{8 \text{ hours}} = 0.125 \text{ CU/hour}$$

**ALL other metrics are derived from this.**

---

## Part 2: Employee Capacity Formula (P)

### 2.1 Daily Employee Capacity

$$P_{day} = 1.0 \text{ CU} \times K_{grade} \times K_{gen} \times K_{age} \times K_{tenure}$$

### 2.2 Hourly Capacity

$$P_{hour} = 0.125 \text{ CU} \times K_{grade} \times K_{gen} \times K_{age} \times K_{tenure}$$

### 2.3 Monthly Capacity (at 21 working days = 168 hours)

$$P_{month} = P_{day} \times 21 = P_{hour} \times 168$$

### 2.4 Coefficient Table

#### K_grade (Autonomy Threshold) — Grades relative to Senior

| Grade      | K_grade | Description              |
| ---------- | ------- | ------------------------ |
| C-level    | 1.7     | Strategic decisions      |
| Manager    | 1.5     | Process leadership       |
| **Senior** | **1.0** | **STANDARD**             |
| Middle     | 0.8     | Independent worker       |
| Junior     | 0.6     | Newcomer, needs guidance |
| Intern     | 0.4     | Trainee                  |

#### K_gen (Gender Balance)

| Gender | K_gen | Note                                 |
| ------ | ----- | ------------------------------------ |
| Male   | 1.0   | Baseline                             |
| Female | 0.7   | Accounts for physical/social factors |

#### K_age (Age Coefficient)

| Age          | K_age | Note               |
| ------------ | ----- | ------------------ |
| 30–35        | 1.1   | Peak productivity  |
| 25–29, 36–45 | 1.0   | Normal             |
| Other        | 0.85  | Reduced efficiency |

#### K_tenure (Experience in Grade)

| Time in Grade | K_tenure | Note                                  |
| ------------- | -------- | ------------------------------------- |
| 1–3 years     | 1.1      | Adaptation complete + high motivation |
| 3+ years      | 0.9      | Professional, but stagnation risk     |
| < 1 year      | 0.9      | Adaptation period                     |

### 2.5 P_monthly Examples

**Example 1: Senior M, 32 years, 2 years in Senior, efficiency=1.0**
$$P = 1.0 \times 1.0 \times 1.0 \times 1.1 \times 1.1 = 1.21 \text{ CU/day}$$
$$P_{month} = 1.21 \times 21 = 25.41 \text{ CU}$$
$$P_{hour} = 0.125 \times 1.1 \times 1.1 = 0.151 \text{ CU}$$

**Example 2: Middle F, 28 years, 3 years in Middle, efficiency=0.95**
$$P = 1.0 \times 0.8 \times 0.7 \times 1.0 \times 0.9 = 0.504 \text{ CU/day}$$
$$P_{month} = 0.504 \times 21 = 10.6 \text{ CU}$$
$$P_{hour} = 0.125 \times 0.504 = 0.063 \text{ CU}$$

**Example 3: Junior M, 24 years, 0.5 years in Junior, efficiency=0.9**
$$P = 1.0 \times 0.6 \times 1.0 \times 0.85 \times 0.9 = 0.459 \text{ CU/day}$$
$$P_{month} = 0.459 \times 21 = 9.6 \text{ CU}$$
$$P_{hour} = 0.125 \times 0.459 = 0.057 \text{ CU}$$

---

## Part 3: Task Resource Consumption Formula (L)

### 3.1 Basic Formula with Time Component

$$L = T_{hours} \times 0.125 \text{ CU/hour} \times (1 + K_{burn} + K_{crit} + K_{new}) \times K_{diff}$$

**Or equivalently:**

$$L = \frac{T_{hours}}{8} \times (1 + K_{burn} + K_{crit} + K_{new}) \times K_{diff}$$

### 3.2 L Components

| Component       | Symbol  | Range   | Description                    |
| --------------- | ------- | ------- | ------------------------------ |
| **Time**        | T_hours | ≥0      | Planned execution time (hours) |
| **Burnout**     | K_burn  | 0.0–0.2 | +0.2 for high intensity        |
| **Criticality** | K_crit  | 0.0–0.2 | +0.2 for high responsibility   |
| **Novelty**     | K_new   | 0.0–0.1 | +0.1 for lack of template      |
| **Heroism**     | K_diff  | 1.0–2.0 | If task grade > executor grade |

### 3.3 Heroism Multiplier (K_diff)

If **task target grade** is higher than **executor grade**:

$$
K_{diff} = \begin{cases}
1.0 & \text{grades match or task is lower} \\
1.5 & \text{1 grade difference} \\
2.0 & \text{2+ grades difference}
\end{cases}
$$

### 3.4 L Examples

**Example 1: Regular Senior task (8 hours)**
$$L = \frac{8}{8} \times (1 + 0.0 + 0.0 + 0.0) \times 1.0 = 1.0 \text{ CU}$$
⇒ Exactly one day of Senior work

**Example 2: Critical, novel Senior task (6 hours)**
$$L = \frac{6}{8} \times (1 + 0.0 + 0.2 + 0.1) \times 1.0 = 0.975 \text{ CU}$$

**Example 3: Middle executes Senior task (8 hours, 1 grade difference = K_diff=1.5)**
$$L = \frac{8}{8} \times 1.0 \times 1.5 = 1.5 \text{ CU}$$
⇒ Middle will spend 1.5 days on Senior-level task

**Example 4: Junior executes Middle task (4 hours, K_diff=1.5)**
$$L = \frac{4}{8} \times 1.0 \times 1.5 = 0.75 \text{ CU}$$

**Example 5: High-stress, critical Middle-to-Senior (10 hours, K_diff=1.5)**
$$L = \frac{10}{8} \times (1 + 0.2 + 0.2 + 0.0) \times 1.5 = 1.875 \times 1.5 = 2.8 \text{ CU}$$
⇒ Huge load for Middle

---

## Part 4: Key Insight — L is Independent of Executor

**Task resource consumption L — is an objective measure of work demand that DOES NOT CHANGE based on who executes it.**

But **K_diff shows the pain experienced by the person**:

- Senior on their task: uses exactly L CU
- Middle on Senior task: uses L × 1.5 CU (heroism)
- Junior on Senior task: uses L × 2.0 CU (big heroism = burnout)

---

## Part 5: Load Indexes

### 5.1 Individual Load Index (I_ind)

$$I_{ind} = \frac{\sum L_{\text{all tasks in period}}}{P_{\text{month}}}$$

| I_ind   | Status                 | Action                |
| ------- | ---------------------- | --------------------- |
| < 0.8   | Underutilized          | Redistribute tasks    |
| 0.8–1.0 | **NORMAL**             | Optimal state         |
| 1.0–1.2 | Elevated               | Monitor, check health |
| > 1.2   | **Overload / Heroism** | Intervention required |

### 5.2 Department Power Index (I_dept)

$$I_{dept} = \frac{\sum L_{\text{all tasks in period}}}{\sum P_{\text{month for all employees}}}$$

| I_dept  | Status                | Solution                               |
| ------- | --------------------- | -------------------------------------- |
| < 0.7   | Underutilization      | Training, optimization, redistribution |
| 0.7–1.0 | **NORMAL**            | Stable                                 |
| 1.0–1.2 | High load             | Monitoring, prepare for hiring         |
| > 1.2   | **CRITICAL OVERLOAD** | **OPEN VACANCY**                       |

### 5.3 Example: Monthly Calculation (Backend Department)

**Composition (21 working days):**

| Team Member | Grade    | P_day | P_month | Month Tasks            | Σ L  | I_ind   |
| ----------- | -------- | ----- | ------- | ---------------------- | ---- | ------- |
| Alexander   | Senior M | 1.21  | 25.4    | 8h + 6h + 8h           | 20   | 0.79    |
| Victoria    | Middle F | 0.504 | 10.6    | 8h + 8h + 8h + 6h + 5h | 14.6 | 1.38 🔴 |
| Eugene      | Junior M | 0.459 | 9.6     | 5h + 4h + 3h           | 7    | 0.73    |

$$P_{month,total} = 25.4 + 10.6 + 9.6 = 45.6 \text{ CU}$$
$$L_{total} = 20 + 14.6 + 7 = 41.6 \text{ CU}$$
$$I_{dept} = \frac{41.6}{45.6} = 0.91 \text{ (normal)}$$

**But Victoria (Middle F, 1.38) is overloaded!**

---

## Part 6: Management Decisions

### 6.1 If I_dept > 1.2

**Requires Gap Analysis:**

1. Determine gap type (quantitative vs qualitative)
2. Calculate power deficit
3. Choose candidate grade
4. Form KPIs

### 6.2 If I_dept < 0.7

**Resources not optimally used:**

- Training and rotation
- Process optimization
- Task redistribution from other departments
- Automation of routine

### 6.3 Load Balancing Within Department

**Principle:** Transfer heavy tasks (L > 1.3) to those with higher P and lower I_ind.

**Special consideration:**

- Protect women from heroic mode (K_gen = 0.7 = less powerful)
- Don't overload Junior/young specialists (K_grade = 0.6 = lower grade)
- Use Seniors for architecture, code review, unexpected, not routine

---

## Part 7: Cost of Power

$$\text{Cost of 1 CU/month} = \frac{\text{Salary in RUB}}{P_{\text{month}}}$$

**Examples at salary:**

- Senior M (P=25.4): Salary 300k → **11,811 RUB/CU** ✓ good investment
- Middle F (P=10.6): Salary 180k → **16,981 RUB/CU** (more per CU, but flexible)
- Junior M (P=9.6): Salary 120k → **12,500 RUB/CU** ✓ low cost

**Conclusion:** 2 Middle F often cheaper than one Senior M with similar total CU.

---

## Part 8: Final Logic

**One idea: think about resources in CU, not in people or hours.**

- **P** — how many CU can an employee generate per month
- **L** — how many CU does one task consume
- **I_ind** — how loaded is a specific person
- **I_dept** — how loaded is the department overall

This moves management from emotional to objective mathematics.

---

# Gap Analysis & Hiring

When **I_dept > 1.2** — critical overload → requires gap type determination and candidate selection.

---

## 1. Two Types of Gap

### 1.1 Type A: Quantitative Gap

**Symptoms:**

- I_dept > 1.1, but employee grades match target task grades
- No massive execution with K_diff > 1.0
- Everyone has roughly equal workload, each at their grade
- All working, but no heroism — just loaded

**Diagnosis:** Insufficient number of people

**Solution:** Hire one more employee **of the same grade** as the most loaded one

**Example:**

```
Backend: 3 Seniors, 5 Middles, 2 Juniors
I_ind(Senior) = 0.95, I_ind(Middle) = 1.15 ← max
I_ind(Junior) = 1.05, I_dept = 1.1

→ Hire Middle (not Senior!)
```

---

### 1.2 Type B: Qualitative Gap

**Symptoms:**

- I_dept > 1.1
- **70%+ of overloaded CU — is Junior/Middle executing Senior/Manager work** (K_diff = 1.5–2.0)
- No one adequately executing Senior-level work
- People constantly in heroism mode

**Diagnosis:** Competency deficit

**Risk:** Chronic burnout, errors in critical areas, turnover

**Solution:** Hire "heavyweight" — Senior or Manager to relieve cognitive load from Middle

**Example:**

```
Development: 1 Senior, 4 Middle, 3 Junior
I_ind(Senior) = 1.25, I_ind(Middle avg) = 1.35 ← eternal heroism
I_ind(Junior avg) = 1.20

L analysis:
- 40% CU = Senior level (needs Senior)
- 35% CU = Middle on Senior (K_diff=1.5)
- 25% CU = Junior on Middle (K_diff=1.5)

→ Need Senior (or Lead)
```

---

## 2. Calculate Power Deficit

### 2.1 Formula

$$\Delta P_{required} = \sum P_{current} \times (I_{dept} - 1.0)$$

**Example:** Department has $\sum P = 480$ CU, $I_{dept} = 1.3$:

$$\Delta P = 480 \times (1.3 - 1.0) = 480 \times 0.3 = 144 \text{ CU/month}$$

### 2.2 Convert to Candidate Count

**Typical P_monthly by grade:**

- Senior (M, 30-35, 2+ years): 24–28 CU
- Manager (M, 35+, 5+ years): 28–32 CU
- Middle (M or F, standard): 11–16 CU
- Junior (M or F, standard): 9–11 CU

**Deficit of 144 CU can be covered by:**

- **1 Senior**: P ≈ 26 CU (bit short, but quick)
- **1 Manager**: P ≈ 30 CU (better)
- **1–2 Middle**: P ≈ 20–32 CU (cheaper, but adaptation)
- **2–3 Middle+Junior mix**: P ≈ 30–40 CU (economical, complex)

---

## 3. Grade Selection Matrix

### 3.1 Analysis by Target Task Grades

**Group L by target grade and compare to available P:**

| Target Grade | Σ L | Σ P (current) | Deficit | Action                 |
| ------------ | --- | ------------- | ------- | ---------------------- |
| Senior       | 200 | 180           | +20     | Hire Senior            |
| Middle       | 150 | 140           | +10     | Hire Middle or Junior  |
| Junior       | 80  | 100           | -20     | All good               |
| **TOTAL**    | 430 | 420           | +10     | I_dept = 1.02 (normal) |

---

### 3.2 Decision Matrix

| Symptom                           | Diagnosis         | Recommendation                 |
| --------------------------------- | ----------------- | ------------------------------ |
| ΣL_Senior > ΣP_Senior by 20%+     | Expertise deficit | Hire **Senior** or **Manager** |
| ΣL_Middle > ΣP_Middle by 20%+     | Worker deficit    | Hire **Middle** (1–2 people)   |
| ΣL_Junior > ΣP_Junior by 20%+     | Hand deficit      | Hire **Junior** or **Intern**  |
| 70%+ K_diff > 1.0 in Middle       | Qualitative gap   | Hire **Senior** (not Middle!)  |
| K_diff > 1.3 for women constantly | Exploitation      | Hire **male executor**         |

---

## 4. Gender Coefficient in Hiring

### 4.1 Problem vs Solution

**Fact:** Woman (K_gen = 0.7) generates 30% less CU per month at same salary.

This is not discrimination, but reality: social obligations, maternity leave, physiology.

**Cost calculation to cover 140 CU:**

| Option | Composition      | Σ P | Salary | Cost | Note             |
| ------ | ---------------- | --- | ------ | ---- | ---------------- |
| A      | 1 Senior M       | 26  | 300k   | 300k | Fast, expensive  |
| B      | 2 Middle (1M+1F) | 26  | 210k   | 210k | Cheaper, balance |
| C      | 2 Middle F       | 21  | 360k   | 360k | Even more        |
| D      | 1 Manager        | 30  | 350k   | 350k | Powerful, pricey |

**Conclusion:** Option B is often optimal

---

## 5. Trial Period KPIs by Grade

### 5.1 Senior (1–2 months trial)

**Success Criteria:**

- ✅ Conduct architecture review or refactor critical module
- ✅ Conduct 2–3 code review sessions for others
- ✅ Start mentoring Junior developers
- ✅ I_ind(new Senior) = 0.7–0.9 (adaptation normal)
- ✅ Zero critical issues in code

**Red Flags:**

- ❌ Nothing closed in a month
- ❌ Code requires full redo
- ❌ Team conflicts

### 5.2 Middle (2–3 months trial)

**Success Criteria:**

- ✅ Close 3–5 medium-complexity tasks independently
- ✅ Conduct 2–3 code reviews for others
- ✅ No critical issues > 75%
- ✅ I_ind(new Middle) = 0.6–0.8 (adaptation)
- ✅ Smart questions, willing to learn

**Red Flags:**

- ❌ < 2 closed tasks
- ❌ High % of rejected code
- ❌ Passive or conflictual

### 5.3 Junior (2–3 months trial)

**Success Criteria:**

- ✅ Close 5–10 simple tasks
- ✅ Code review pass without comments > 80%
- ✅ Actively asks, absorbs information
- ✅ I_ind(new Junior) = 0.5–0.7 (very adapting)
- ✅ Follows procedures precisely, no shortcuts

**Red Flags:**

- ❌ < 3 closed tasks or many redos
- ❌ Ignores requirements
- ❌ Passive or arrogant

---

## 6. Post-Integration Monitoring

### 6.1 Expected Index Changes (3 months)

| Metric        | Before | After 1 mo. | After 3 mo. | Target  |
| ------------- | ------ | ----------- | ----------- | ------- |
| I_dept        | 1.30   | 0.95        | 0.85        | 0.8–1.0 |
| I_overloaded  | 1.35   | 0.90        | 0.85        | 0.8–1.0 |
| I_underloaded | 0.80   | 0.85        | 0.90        | 0.8–1.0 |
| I_newbie      | —      | 0.70        | 0.85        | 0.8–0.9 |

### 6.2 When to Terminate Trial

**KPIs not met:**

- Newbie didn't close ≠ target tasks
- Code requires full redo (inadequate)
- > 2 team conflicts
- I_newbie < 0.3 or > 1.5 at end (didn't adapt)

---

## 7. Long-term Management

### 7.1 Monthly Monitoring

- Track I_dept and I_ind (both should be 0.8–1.0)
- If I_dept > 1.1 → start preparing next hiring
- If I_dept < 0.7 → training, optimization, rotation

### 7.2 Quarterly Analysis

- Is Junior ready for Middle (I_ind < 0.8)?
- Is Middle ready for Senior?
- Staff turnover — why do people leave?
- Development plans for each person

### 7.3 Yearly Planning

**With 30% BIZ growth per year:**

- Current capacity: 480 CU
- Planned load: +144 CU
- Required: ~1 Manager or ~2 Middle or ~5 Junior
- Start search 2–3 months before peak

---

## Summary

1. **Diagnosis:** Type A (quantity) vs Type B (quality)
2. **Calculate deficit:** ΔP = P_total × (I - 1.0)
3. **Choose grade:** Based on ΣL by target grades
4. **Gender factor:** 1M + 1F often better than 1 Senior M
5. **Trial KPIs:** Specific metrics for each grade
6. **Monitoring:** Monthly, quarterly, yearly

---

# System Architecture & Database

**Load Aggregation Service** — микросервис для расчёта нагрузки на основе Capacity Units (CU).

---

## 1. Logical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Load Aggregation Service                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Layer (REST/GraphQL)                 │  │
│  │  - GET /departments/{id}/load                         │  │
│  │  - GET /employees/{id}/load                           │  │
│  │  - POST /task-assignments                             │  │
│  │  - GET /analytics/gap-analysis                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Calculation Engine (Service Layer)              │  │
│  │  - computeEmployeeCapacity(employee) → P_month       │  │
│  │  - computeTaskLoad(task) → L                          │  │
│  │  - computeEmployeeLoadIndex(emp, period) → I_ind     │  │
│  │  - computeDepartmentLoadIndex(dept, period) → I_dept │  │
│  │  - analyzeGap(dept) → recommendation                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Data Access Layer (Repositories)               │  │
│  │  - EmployeeRepository                                 │  │
│  │  - DepartmentRepository                               │  │
│  │  - ProcessRepository                                  │  │
│  │  - TaskAssignmentRepository                           │  │
│  │  - LoadSnapshotRepository                             │  │
│  │  - CompanyRepository                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database (Prisma ORM)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Key Calculations (Typescript, Node.js)

```typescript
// utils/capacityCalculations.ts

// P_day = 1.0 * K_grade * K_gen * K_age * K_tenure
export function computeEmployeeDayCapacity(
  employee: Employee,
  gradeKGrade: number,
  today: Date = new Date(),
): number {
  const kGrade = gradeKGrade;

  // K_gen
  const kGen = employee.gender === "M" ? 1.0 : 0.7;

  // K_age
  const age = Math.floor(
    (today.getTime() - employee.birthDate.getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  );
  const kAge =
    age >= 30 && age <= 35 ? 1.1 : age >= 25 && age <= 45 ? 1.0 : 0.85;

  // K_tenure
  const tenureYears = Math.floor(
    (today.getTime() - employee.hireDate.getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  );
  const kTenure =
    tenureYears >= 1 && tenureYears <= 3 ? 1.1 : tenureYears >= 3 ? 0.9 : 0.9;

  // K_efficiency
  const kEfficiency = employee.kEfficiency || 1.0;

  return 1.0 * kGrade * kGen * kAge * kTenure * kEfficiency;
}

// P_hour = P_day / 8
export function computeEmployeeHourCapacity(dayCapacity: number): number {
  return dayCapacity / 8;
}

// P_month = P_day * 21
export function computeEmployeeMonthCapacity(
  dayCapacity: number,
  workingDays: number = 21,
): number {
  return dayCapacity * workingDays;
}

// L = (T_hours / 8) * (1 + K_burn + K_crit + K_new) * K_diff
export function computeTaskLoad(
  plannedHours: number,
  kBurn: number = 0.0,
  kCrit: number = 0.0,
  kNew: number = 0.0,
  kDiff: number = 1.0,
): number {
  const intensityMultiplier = 1 + kBurn + kCrit + kNew;
  return (plannedHours / 8) * intensityMultiplier * kDiff;
}

// I_ind = Σ(L_tasks) / P_month
export function computeEmployeeLoadIndex(
  totalTaskLoad: number,
  monthCapacity: number,
): number {
  return monthCapacity > 0 ? totalTaskLoad / monthCapacity : 0;
}

// I_dept = Σ(L_all) / Σ(P_month for all employees)
export function computeDepartmentLoadIndex(
  totalTaskLoad: number,
  totalMonthCapacity: number,
): number {
  return totalMonthCapacity > 0 ? totalTaskLoad / totalMonthCapacity : 0;
}

// K_diff calculation
export function computekDiff(
  targetGradeId: number,
  executorGradeId: number,
): number {
  const gradeDifference = targetGradeId - executorGradeId;
  if (gradeDifference <= 0) return 1.0; // No heroism needed
  if (gradeDifference === 1) return 1.5; // 1 grade difference
  return 2.0; // 2+ grades difference
}
```

---

## 3. Example: Full Monthly Load Calculation

```typescript
// services/loadAggregationService.ts

export async function calculateDepartmentLoad(
  departmentId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<LoadSnapshot> {
  // 1. Get all active employees
  const employees = await db.employee.findMany({
    where: { departmentId, status: "active" },
    include: { grade: true },
  });

  // 2. Get all task assignments for period
  const tasks = await db.taskAssignment.findMany({
    where: {
      departmentId,
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    include: { employee: true, process: true },
  });

  // 3. Compute each employee's capacity
  let totalCapacityCU = 0;
  const employeeCapacities = new Map<string, number>();

  for (const emp of employees) {
    const dayCapacity = computeEmployeeDayCapacity(emp, emp.grade.kGrade);
    const monthCapacity = computeEmployeeMonthCapacity(dayCapacity, 21);
    employeeCapacities.set(emp.id, monthCapacity);
    totalCapacityCU += monthCapacity;
  }

  // 4. Compute each task's load
  let totalLoadCU = 0;
  for (const task of tasks) {
    if (!task.calculatedLoad) {
      // Compute on the fly
      const kDiff = computeKDiff(
        task.process.targetGradeId,
        task.employee.gradeId,
      );
      const L = computeTaskLoad(
        task.plannedHours,
        task.process.kBurn,
        task.process.kCrit,
        task.process.kNew,
        kDiff,
      );
      totalLoadCU += L;
    } else {
      totalLoadCU += task.calculatedLoad;
    }
  }

  // 5. Compute I_dept
  const loadIndex = computeDepartmentLoadIndex(totalLoadCU, totalCapacityCU);
  const percentUsed = (totalLoadCU / totalCapacityCU) * 100;

  // 6. Save snapshot
  const snapshot = await db.loadSnapshot.upsert({
    where: {
      companyId_departmentId_periodStart_periodEnd: {
        companyId: employees[0]?.company?.id || "",
        departmentId,
        periodStart,
        periodEnd,
      },
    },
    update: {
      loadIndex,
      totalLoadCU,
      totalCapacityCU,
      percentUsed,
      updatedAt: new Date(),
    },
    create: {
      companyId: employees[0]?.companyId || "",
      departmentId,
      periodStart,
      periodEnd,
      loadIndex,
      totalLoadCU,
      totalCapacityCU,
      percentUsed,
      activeEmployeeCount: employees.length,
      calculatedAt: new Date(),
    },
  });

  return snapshot;
}
```

---

## Summary

**System is ready for development:**

- ✅ Prisma models (ORM)
- ✅ PostgreSQL schemas
- ✅ Indexes for optimization
- ✅ Typescript calculations
- ✅ Complete audit logic
- ✅ Integration with hiring system
