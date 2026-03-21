/**
 * Employee Capacity Calculator
 * Implements complete formula from capacity-units.md spec
 * P_month = 1.0 × K_grade × K_gen × K_age × K_tenure × K_efficiency
 * No database dependencies - just math
 */

export interface EmployeeCapacityInput {
  gradeKFactor: number; // From Grade.kGrade (0.4 to 1.7)
  gender: "MALE" | "FEMALE" | "OTHER"; // From Employee.gender
  age: number; // Calculated from birthDate
  yearsInGrade: number; // Calculated from hire date and grade assignment
  workingHoursPerDay?: number; // From Employee.workingHoursPerDay (default 8)
  workingDaysPerMonth?: number; // From Company.workingDaysPerMonth (default 21)
  kEfficiencyOverride?: number; // Optional override (default 1.0), useful for special cases
}

export interface EmployeeCapacityOutput {
  monthlyCU: number; // Capacity Units per month
  dailyCU: number; // Capacity Units per day
  weeklyCU: number; // Capacity Units per week
  hourlyCP: number; // Capacity Units per hour
  workingHoursPerMonth: number; // Total working hours per month
  factors: {
    kGrade: number;
    kGender: number;
    kAge: number;
    kTenure: number;
    kEfficiency: number;
  };
  breakdown: string; // Human-readable explanation
}

/**
 * Calculate K_gender from employee gender
 * Accounts for average physical/social factors
 */
function calculateKGender(gender: "MALE" | "FEMALE" | "OTHER"): number {
  switch (gender) {
    case "MALE":
      return 1.0; // Baseline
    case "FEMALE":
      return 0.7; // Accounts for physical/social considerations
    case "OTHER":
      return 1.0; // Treat as baseline if not specified
    default:
      return 1.0;
  }
}

/**
 * Calculate K_age based on age brackets
 * Reflects typical productivity patterns across career
 */
function calculateKAge(age: number): number {
  if (age >= 30 && age <= 35) {
    return 1.1; // Peak productivity years
  } else if ((age >= 25 && age < 30) || (age > 35 && age <= 45)) {
    return 1.0; // Normal productivity
  } else if (age < 25 || age > 45) {
    return 0.85; // Reduced efficiency
  }
  return 1.0;
}

/**
 * Calculate K_tenure based on years in current grade
 * Reflects ramp-up time and motivation
 */
function calculateKTenure(yearsInGrade: number): number {
  if (yearsInGrade >= 1 && yearsInGrade <= 3) {
    return 1.1; // Adaptation complete + high motivation
  } else if (yearsInGrade > 3) {
    return 0.9; // Professional, but stagnation risk
  } else if (yearsInGrade < 1) {
    return 0.9; // Still ramping up on new grade
  }
  return 1.0;
}

/**
 * Calculate employee's monthly capacity in CU
 *
 * Formula (from capacity-units.md):
 * P_day = 1.0 CU × K_grade × K_gen × K_age × K_tenure × K_efficiency
 * P_month = P_day × workingDaysPerMonth
 * P_hour = P_day / workingHoursPerDay
 *
 * Example:
 * - Senior (kGrade=1.0), Male (kGen=1.0), Age 32 (kAge=1.1), 2 years (kTenure=1.1)
 * - P_day = 1.0 × 1.0 × 1.0 × 1.1 × 1.1 × 1.0 = 1.21 CU/day
 * - P_month = 1.21 × 21 = 25.41 CU
 */
export function calculateEmployeeCapacity(
  input: EmployeeCapacityInput,
): EmployeeCapacityOutput {
  const {
    gradeKFactor,
    gender,
    age,
    yearsInGrade,
    workingHoursPerDay = 8,
    workingDaysPerMonth = 21,
    kEfficiencyOverride = 1.0,
  } = input;

  // Calculate all multiplier factors
  const kGender = calculateKGender(gender);
  const kAge = calculateKAge(age);
  const kTenure = calculateKTenure(yearsInGrade);
  const kEfficiency = kEfficiencyOverride;

  // Base formula: 1.0 × all factors
  const dailyMultiplier = gradeKFactor * kGender * kAge * kTenure * kEfficiency;
  const baseDailyCU = 1.0 * dailyMultiplier;

  // Calculate various time periods
  const workingHoursPerMonth = workingDaysPerMonth * workingHoursPerDay;
  const monthlyCU = baseDailyCU * workingDaysPerMonth;
  const dailyCU = baseDailyCU;
  const weeklyCU = (5 / 7) * monthlyCU; // 5 working days per week
  const hourlyCP = baseDailyCU / workingHoursPerDay;

  const breakdown = `
Capacity Calculation (P_month = 1.0 × K_grade × K_gen × K_age × K_tenure × K_efficiency):

Factors:
  Grade multiplier (K_grade): ${gradeKFactor}
  Gender multiplier (K_gen): ${kGender} (${gender})
  Age multiplier (K_age): ${kAge} (Age ${age})
  Tenure multiplier (K_tenure): ${kTenure} (${yearsInGrade} years in grade)
  Efficiency multiplier (K_efficiency): ${kEfficiency}

Daily Capacity:
  P_day = 1.0 × ${gradeKFactor} × ${kGender} × ${kAge} × ${kTenure} × ${kEfficiency}
  P_day = ${dailyCU.toFixed(3)} CU/day

Monthly Capacity (${workingDaysPerMonth} working days):
  P_month = ${dailyCU.toFixed(3)} × ${workingDaysPerMonth} = ${monthlyCU.toFixed(2)} CU/month

Other Time Periods:
  Weekly: ${weeklyCU.toFixed(2)} CU/week
  Hourly: ${hourlyCP.toFixed(4)} CU/hour
  Working hours/month: ${workingHoursPerMonth}h`;

  return {
    monthlyCU,
    dailyCU,
    weeklyCU,
    hourlyCP,
    workingHoursPerMonth,
    factors: {
      kGrade: gradeKFactor,
      kGender,
      kAge,
      kTenure,
      kEfficiency,
    },
    breakdown,
  };
}

/**
 * Adjust capacity for actual working status
 * If employee is on leave/inactive, reduce Available capacity
 */
export function adjustCapacityForStatus(
  monthlyCU: number,
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED",
): number {
  const statusMultiplier: Record<string, number> = {
    ACTIVE: 1.0,
    ON_LEAVE: 0.0,
    INACTIVE: 0.0,
    TERMINATED: 0.0,
  };

  return monthlyCU * (statusMultiplier[status] ?? 1.0);
}
