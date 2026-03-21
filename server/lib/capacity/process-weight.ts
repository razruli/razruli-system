/**
 * Process Weight Calculator
 * Pure calculation utility for process complexity weight
 * No database dependencies - just math
 */

export interface ProcessWeightInput {
  plannedHours: number;
  complexity: string; // routine|standard|complex|expert
  businessImpact: string; // low|medium|high|critical
  newness: string; // routine|familiar|new|experimental
  isBurningOut: boolean;
}

export interface KFactors {
  kBurn: number; // Team burnout/stress factor (0.0-1.0)
  kCrit: number; // Business criticality factor (0.0-1.0)
  kNew: number; // Newness/learning factor (0.0-0.5)
}

export interface ProcessWeightOutput {
  weight: number; // Process weight in CU
  kFactors: KFactors;
  breakdown: string; // Human-readable explanation
}

/**
 * Convert complexity level to burnout factor
 * routine (0.0) → Junior-level, no stress
 * standard (0.1) → Mid-level, minimal stress
 * complex (0.3) → Senior-level, moderate stress
 * expert (0.5) → Lead-level, high burnout
 */
function complexityToKBurn(complexity: string): number {
  const mapping: Record<string, number> = {
    routine: 0.0,
    standard: 0.1,
    complex: 0.3,
    expert: 0.5,
  };
  return mapping[complexity] ?? 0.1;
}

/**
 * Burnout flag adds additional stress component
 */
function isBurningOutBoost(isBurningOut: boolean): number {
  return isBurningOut ? 0.2 : 0.0;
}

/**
 * Convert business impact to criticality factor
 * low (0.0) → Nice to have
 * medium (0.1) → Normal business work
 * high (0.5) → Important for operations
 * critical (1.0) → System down, revenue impact
 */
function businessImpactToKCrit(impact: string): number {
  const mapping: Record<string, number> = {
    low: 0.0,
    medium: 0.1,
    high: 0.5,
    critical: 1.0,
  };
  return mapping[impact] ?? 0.1;
}

/**
 * Convert newness/learning curve to learning factor
 * routine (0.0) → Done before, well-known
 * familiar (0.1) → Similar tech, minor learning
 * new (0.3) → New framework/pattern, significant learning
 * experimental (0.5) → Cutting edge, high uncertainty
 */
function newnessToKNew(newness: string): number {
  const mapping: Record<string, number> = {
    routine: 0.0,
    familiar: 0.1,
    new: 0.3,
    experimental: 0.5,
  };
  return mapping[newness] ?? 0.1;
}

/**
 * Calculate k-factor values from human-readable process attributes
 */
function calculateKFactors(input: ProcessWeightInput): KFactors {
  const kBurn =
    complexityToKBurn(input.complexity) + isBurningOutBoost(input.isBurningOut);
  const kCrit = businessImpactToKCrit(input.businessImpact);
  const kNew = newnessToKNew(input.newness);

  return {
    kBurn: Math.min(kBurn, 1.0), // Cap at 1.0
    kCrit,
    kNew,
  };
}

/**
 * Calculate process weight (CU consumption)
 *
 * Formula:
 * Weight = (plannedHours / 8) × (1 + kBurn + kCrit + kNew)
 *
 * Example:
 * - Task: 20 hours, standard complexity, high impact, new tech, not burning out
 * - kBurn = 0.1 (standard)
 * - kCrit = 0.5 (high impact)
 * - kNew = 0.3 (new tech)
 * - Weight = (20/8) × (1 + 0.1 + 0.5 + 0.3) = 2.5 × 1.9 = 4.75 CU
 */
export function calculateProcessWeight(
  input: ProcessWeightInput,
): ProcessWeightOutput {
  const kFactors = calculateKFactors(input);

  const baseUnits = input.plannedHours / 8;
  const complexityMultiplier =
    1 + kFactors.kBurn + kFactors.kCrit + kFactors.kNew;
  const weight = baseUnits * complexityMultiplier;

  const breakdown = `
Process Weight Calculation:
  Planned hours: ${input.plannedHours}h
  Base CU: ${input.plannedHours} ÷ 8 = ${baseUnits.toFixed(2)}
  
Complexity Factors:
  Complexity "${input.complexity}" → kBurn = ${complexityToKBurn(input.complexity)}
  Business Impact "${input.businessImpact}" → kCrit = ${kFactors.kCrit}
  Newness "${input.newness}" → kNew = ${kFactors.kNew}
  Burnout Flag: ${input.isBurningOut ? "Yes (+0.2)" : "No"}
  
Final kBurn: ${kFactors.kBurn.toFixed(2)}
Multiplier: (1 + ${kFactors.kBurn.toFixed(2)} + ${kFactors.kCrit.toFixed(2)} + ${kFactors.kNew.toFixed(2)}) = ${complexityMultiplier.toFixed(2)}

Weight: ${baseUnits.toFixed(2)} × ${complexityMultiplier.toFixed(2)} = ${weight.toFixed(2)} CU`;

  return {
    weight,
    kFactors,
    breakdown,
  };
}
