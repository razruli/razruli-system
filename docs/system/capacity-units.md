# Workload Calculator & Capacity Units System

## Overview

The system uses Capacity Units (CU) as a universal currency for workload management. This document explains how capacity is calculated, how work is assigned, and how the system balances resources across teams.

---

## Part 1: Core Capacity Model

### 1.1 The Golden Standard

All capacity calculations derive from a single baseline:

**Senior developer, male, 30-35 years old, 2+ years in grade, efficiency 1.0**

$$P_{\text{Senior,day}} = 1.0 \text{ CU/day}$$

$$P_{\text{Senior,hour}} = \frac{1.0 \text{ CU}}{8 \text{ hours}} = 0.125 \text{ CU/hour}$$

This is the standard against which all other capacity is measured.

---

### 1.2 Employee Daily Capacity Formula

Each employee's daily capacity is calculated as:

$$P_{\text{day}} = 1.0 \text{ CU} \times K_{\text{grade}} \times K_{\text{gen}} \times K_{\text{age}} \times K_{\text{tenure}} \times K_{\text{efficiency}}$$

Where:

- **1.0 CU** = baseline capacity
- **K_grade** = seniority level multiplier
- **K_gen** = gender adjustment (physical/social factors)
- **K_age** = age-based efficiency
- **K_tenure** = experience in current grade

### 1.3 Hourly & Monthly Capacity

**Hourly Capacity:**
$$P_{\text{hour}} = 0.125 \text{ CU} \times (K_{\text{grade}} \times K_{\text{gen}} \times K_{\text{age}} \times K_{\text{tenure}} \times K_{\text{efficiency}})$$

**Monthly Capacity (at 21 working days = 168 hours):**
$$P_{\text{month}} = P_{\text{day}} \times 21 = P_{\text{hour}} \times 168$$

---

## Part 2: Coefficient Tables

### 2.1 K_grade (Seniority Level)

Represents autonomy threshold and responsibility level:

| Grade      | K_grade | Description                              |
| ---------- | ------- | ---------------------------------------- |
| C-level    | 1.7     | Strategic decisions, company leadership  |
| Manager    | 1.5     | Process leadership, team management      |
| **Senior** | **1.0** | **STANDARD** (Independent expert)        |
| Middle     | 0.8     | Independent worker, some guidance needed |
| Junior     | 0.6     | Newcomer, significant guidance needed    |
| Intern     | 0.4     | Trainee, continuous mentoring            |

**Interpretation:**

- C-level can handle 1.7x more complex work than Senior
- Junior can handle 0.6x capacity of Senior
- Intern can handle 0.4x capacity of Senior

---

### 2.2 K_gen (Gender Balance)

Accounts for average physical and social factors:

| Gender | K_gen | Note                                        |
| ------ | ----- | ------------------------------------------- |
| Male   | 1.0   | Baseline                                    |
| Female | 0.7   | Accounts for physical/social considerations |

**Note:** This is a statistical average. Individuals may vary significantly.

---

### 2.3 K_age (Age-Based Productivity)

Reflects typical productivity patterns across career:

| Age          | K_age | Note                                         |
| ------------ | ----- | -------------------------------------------- |
| 30-35        | 1.1   | Peak productivity years                      |
| 25-29, 36-45 | 1.0   | Normal productivity                          |
| < 25, 45+    | 0.85  | Reduced efficiency (learning/experience lag) |

---

### 2.4 K_tenure (Years in Current Grade)

Reflects ramp-up time and motivation:

| Years in Grade | K_tenure | Note                                  |
| -------------- | -------- | ------------------------------------- |
| 1-3 years      | 1.1      | Adaptation complete + high motivation |
| 3+ years       | 0.9      | Professional, but stagnation risk     |
| < 1 year       | 0.9      | Still ramping up on new grade         |

---

## Part 3: Capacity Examples

### Example 1: Senior Male, 32, 2+ Years in Grade

```
P_day = 1.0 × 1.0 (grade) × 1.0 (gender) × 1.1 (age) × 1.1 (tenure)
      = 1.21 CU/day

P_month = 1.21 × 21 = 25.41 CU/month

P_hour = 0.125 × 1.1 × 1.1 = 0.151 CU/hour
```

**Interpretation:** This senior can handle 25.41 CU of work per month.

---

### Example 2: Middle Female, 28, 3+ Years in Grade

```
P_day = 1.0 × 0.8 (grade) × 0.7 (gender) × 1.0 (age) × 0.9 (tenure)
      = 0.504 CU/day

P_month = 0.504 × 21 = 10.6 CU/month

P_hour = 0.125 × 0.504 = 0.063 CU/hour
```

**Interpretation:** This middle-level developer can handle about 10.6 CU per month.

---

### Example 3: Junior Male, 24, 6 Months in Grade

```
P_day = 1.0 × 0.6 (grade) × 1.0 (gender) × 0.85 (age) × 0.9 (tenure)
      = 0.459 CU/day

P_month = 0.459 × 21 = 9.64 CU/month

P_hour = 0.125 × 0.459 = 0.057 CU/hour
```

---

## Part 4: Task Resource Consumption (Load)

### 4.1 Task Load Formula

Task load is calculated as:

$$L = \frac{\text{planned_hours}}{8} \times (1 + K_{\text{burn}} + K_{\text{crit}} + K_{\text{new}}) \times K_{\text{diff}}$$

Where:

- **planned_hours/8** = number of days of work
- **K_burn** = burnout risk multiplier (0-0.5)
- **K_crit** = criticality multiplier (0-1.0)
- **K_new** = novelty/learning curve multiplier (0-0.8)
- **K_diff** = difficulty adjustment (0.5-2.0)

### 4.2 Complexity Multipliers

**K_burn (Burnout Risk):**

- 0.0 = Standard work, no burnout risk
- 0.3 = High pressure, overtime likely
- 0.5 = Extreme pressure, significant burnout risk

**K_crit (Criticality):**

- 0.0 = Non-critical, can be deprioritized
- 0.5 = Important
- 1.0 = Critical to business, blocks others

**K_new (Novelty/Learning Curve):**

- 0.0 = Standard work, no learning curve
- 0.4 = New techniques, some learning needed
- 0.8 = Entirely new domain, steep learning curve

**K_diff (Difficulty):**

- 0.5 = Very simple tasks
- 1.0 = Standard difficulty
- 1.5 = Complex
- 2.0 = Extremely complex/research-heavy

### 4.3 Task Load Examples

**Example 1: Standard Feature (40 hours)**

```
L = (40/8) × (1 + 0 + 0 + 0) × 1.0
  = 5 × 1 × 1.0
  = 5.0 CU
```

**Example 2: Critical Feature with Learning Curve (40 hours)**

```
L = (40/8) × (1 + 0.3 + 0.5 + 0.4) × 1.0
  = 5 × 2.2 × 1.0
  = 11.0 CU
```

**Example 3: Complex Bug Fix (16 hours, high difficulty)**

```
L = (16/8) × (1 + 0 + 0.5 + 0) × 1.5
  = 2 × 1.5 × 1.5
  = 4.5 CU
```

---

## Part 5: Load Index (System Health)

### 5.1 Load Index Formula

The Load Index measures team health:

**Individual Load Index (I_ind):**
$$I_{\text{ind}} = \frac{\text{Total Assigned Load}}{P_{\text{month}}}$$

**Department Load Index (I_dept):**
$$I_{\text{dept}} = \frac{\sum \text{All Employee Load}}{\sum \text{All Employee Capacity}}$$

### 5.2 Interpretation

| Load Index | Status        | Action                                  |
| ---------- | ------------- | --------------------------------------- |
| < 0.8      | Underutilized | Increase workload or reassign resources |
| 0.8 - 1.0  | Optimal       | Sustainable, well-balanced              |
| 1.0 - 1.2  | Stretched     | High but manageable, temporary OK       |
| > 1.2      | Overloaded    | Unsustainable, causes burnout           |
| > 1.5      | Critical      | System failure imminent                 |

**Examples:**

- Index 0.7: Team has 30% idle capacity
- Index 1.0: Team at 100% capacity (optimal)
- Index 1.3: Team has 30% excess work (burnout risk)

---

## Part 6: Gap Analysis & Hiring

### 6.1 Gap Analysis Questions

When L_dept > 1.0, the system recommends hiring:

**Questions Answered:**

1. How much capacity deficit exists? (deficitCU)
2. What grade should we hire? (recommendedGrade)
3. How many people? (recommendedCount)
4. What's the ROI? (projectedSavings)

### 6.2 Gap Analysis Algorithm

```
1. Calculate current I_dept (load index)

2. If I_dept > 1.0:
   a. Calculate deficit:
      deficitCU = (I_dept - 1.0) × totalCapacityCU

   b. Determine recommended grade:
      - If deficit > 2 × senior_capacity: hire multiple people
      - If mostly complex work: hire Senior
      - If balanced: hire Middle
      - If training-heavy: hire Junior + Senior coach

   c. Calculate hiring count:
      recommendedCount = deficitCU / recommendedGradeCU

   d. Estimate timeline:
      - 2-4 weeks: recruiting
      - 2-4 weeks: hiring/onboarding
      - 4-8 weeks: ramp-up to full productivity

3. Calculate ROI:
   savingsPerMonth = deficitCU × salary_per_cu
   breakEven = totalHiringCost / savingsPerMonth
```

### 6.3 Hiring Example

**Scenario:** Department with I_dept = 1.3

```
Current state:
- Total capacity: 100 CU/month
- Actual load: 130 CU/month
- Deficit: 30 CU/month

Recommendation:
- Hire 1 Senior (25 CU/month): brings I_dept to 1.05
- Or hire 3 Juniors (3 × 10 = 30 CU/month): brings I_dept to 1.0

ROI Analysis:
- Senior salary: $120k/year
  - Will cost initially but generates $120k/year value
  - Break-even in 12 months minimum
  - Long-term value: $120k+/year

- 3 Juniors salary: $90k/year total
  - Cheaper upfront
  - But need 4-12 weeks ramp-up
  - Higher turnover risk
  - Better for growth scaling
```

---

## Part 7: Capacity Calculation in Code

### 7.1 Prisma Schema

```prisma
model Employee {
  id              String @id @default(cuid())
  fio             String
  gradeId         String
  gender          String        // "M" or "F"
  birthDate       DateTime?
  tenure          Int           // Years in current grade
  kEfficiency     Float         // Custom efficiency multiplier
  workingHoursPerDay Int       // Usually 8

  grade           Grade @relation(fields: [gradeId], references: [id])
}

model LoadSnapshot {
  id              String @id @default(cuid())
  employeeId      String
  loadIndex       Float         // Result of I_ind calculation
  totalLoadCU     Float         // Sum of all task loads
  totalCapacityCU Float         // P_month calculated
  percentUsed     Float         // (totalLoadCU / totalCapacityCU) * 100

  employee        Employee @relation(fields: [employeeId], references: [id])
}
```

### 7.2 Service Calculation

```typescript
// EmployeeService
calculateCapacity(employee: Employee): number {
  // Get coefficients
  const kGrade = employee.grade.kGrade;
  const kGen = employee.gender === "F" ? 0.7 : 1.0;
  const kAge = this.getAgeCoefficient(employee.birthDate);
  const kTenure = this.getTenureCoefficient(employee.tenure);
  const kEff = employee.kEfficiency || 1.0;

  // Calculate monthly capacity
  const pDay = 1.0 * kGrade * kGen * kAge * kTenure * kEff;
  const pMonth = pDay * 21; // 21 working days

  return pMonth;
}

// TaskAssignmentService
calculateLoad(task: TaskAssignment): number {
  const plannedDays = task.plannedHours / 8;
  const complexityMultiplier = 1
    + task.process.kBurn
    + task.process.kCrit
    + task.process.kNew;

  const load = plannedDays * complexityMultiplier * (task.kDiff || 1.0);
  return load;
}

// LoadSnapshotService
calculateLoadIndex(employee: Employee): number {
  // Get capacity
  const capacity = this.employeeService.calculateCapacity(employee);

  // Get assigned load
  const tasks = await this.context.loaders.tasksByEmployee.load(employee.id);
  const totalLoad = tasks.reduce((sum, t) => sum + t.calculatedLoad, 0);

  // Calculate index
  const loadIndex = totalLoad / capacity;

  return loadIndex;
}
```

---

## Part 8: System Formulas Summary

### Employee Capacity

$$P_{\text{day}} = 1.0 \times K_{\text{grade}} \times K_{\text{gen}} \times K_{\text{age}} \times K_{\text{tenure}} \times K_{\text{eff}}$$
$$P_{\text{month}} = P_{\text{day}} \times 21$$

### Task Load

$$L = \frac{h}{8} \times (1 + K_{\text{burn}} + K_{\text{crit}} + K_{\text{new}}) \times K_{\text{diff}}$$

### Load Index

$$I_{\text{month}} = \frac{\sum L}{P_{\text{month}}}$$

### Hiring Recommendation

$$\text{Count} = \frac{(I_{\text{month}} - 1.0) \times \sum P}{P_{\text{target grade}}}$$

---

## Related Documentation

- [Database Schema - Analytics Domain](../db/README.md#3-analytics-domain)
- [Services - LoadSnapshotService & GapAnalysisService](../services/README.md#analytics-domain-3-services)
- [System Architecture](./README.md)
- [Request Workflows](./workflows.md)
