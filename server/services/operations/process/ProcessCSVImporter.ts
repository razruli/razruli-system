/**
 * Process CSV Importer
 * Imports business process records from CSV and creates them in the database
 * Uses human-readable complexity fields instead of technical k-factors
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";

export interface ProcessImportRow {
  title: string;
  description?: string;
  plannedHours: string | number;
  complexity?: string; // routine|standard|complex|expert
  businessImpact?: string; // low|medium|high|critical
  newness?: string; // routine|familiar|new|experimental
  isBurningOut?: string; // true|false
  targetGrade: string | number;
  department: string;
  status?: string;
  [key: string]: any;
}

export interface ProcessImportResult {
  success: boolean;
  created: number;
  failed: number;
  errors: Array<{
    rowIndex: number;
    process?: string;
    error: string;
  }>;
}

/**
 * Validates a single process row
 * @param row - Raw CSV row
 * @param requiredFields - Fields that must be present
 * @returns Validation result with errors
 */
export function validateProcessRow(
  row: Record<string, any>,
  requiredFields: string[],
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  for (const field of requiredFields) {
    if (!row[field] || String(row[field]).trim() === "") {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate title
  if (row.title) {
    const title = String(row.title).trim();
    if (title.length < 3) {
      errors.push("Process title must be at least 3 characters");
    }
    if (title.length > 255) {
      errors.push("Process title must not exceed 255 characters");
    }
  }

  // Validate plannedHours - must be positive integer
  if (row.plannedHours !== undefined && row.plannedHours !== null) {
    const hours = Number(row.plannedHours);
    if (isNaN(hours)) {
      errors.push("plannedHours must be a valid number");
    } else if (hours <= 0 || !Number.isInteger(hours)) {
      errors.push("plannedHours must be a positive integer");
    } else if (hours > 10000) {
      errors.push("plannedHours must not exceed 10000");
    }
  }

  // Validate complexity - human-readable skill level (optional, defaults to standard)
  if (row.complexity && String(row.complexity).trim()) {
    const complexity = String(row.complexity).trim().toLowerCase();
    const validComplexities = ["routine", "standard", "complex", "expert"];
    if (!validComplexities.includes(complexity)) {
      errors.push(
        `complexity must be one of: ${validComplexities.join(", ")} (got: ${row.complexity})`,
      );
    }
  }

  // Validate businessImpact - business importance (optional, defaults to medium)
  if (row.businessImpact && String(row.businessImpact).trim()) {
    const impact = String(row.businessImpact).trim().toLowerCase();
    const validImpacts = ["low", "medium", "high", "critical"];
    if (!validImpacts.includes(impact)) {
      errors.push(
        `businessImpact must be one of: ${validImpacts.join(", ")} (got: ${row.businessImpact})`,
      );
    }
  }

  // Validate newness - learning curve (optional, defaults to routine)
  if (row.newness && String(row.newness).trim()) {
    const newness = String(row.newness).trim().toLowerCase();
    const validNewness = ["routine", "familiar", "new", "experimental"];
    if (!validNewness.includes(newness)) {
      errors.push(
        `newness must be one of: ${validNewness.join(", ")} (got: ${row.newness})`,
      );
    }
  }

  // Validate isBurningOut - boolean flag (optional, defaults to false)
  if (row.isBurningOut && String(row.isBurningOut).trim()) {
    const burnout = String(row.isBurningOut).trim().toLowerCase();
    if (!["true", "false"].includes(burnout)) {
      errors.push(
        `isBurningOut must be true or false (got: ${row.isBurningOut})`,
      );
    }
  }

  // Validate status - should be valid status value (optional)
  if (row.status && String(row.status).trim()) {
    const status = String(row.status).trim().toLowerCase();
    const validStatuses = [
      "open",
      "in_progress",
      "completed",
      "closed",
      "on_hold",
    ];
    if (!validStatuses.includes(status)) {
      errors.push(
        `status must be one of: ${validStatuses.join(", ")} (got: ${row.status})`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates all process rows
 */
export function validateProcessRows(
  rows: ProcessImportRow[],
  requiredFields: string[],
): Array<{ valid: boolean; errors: string[] }> {
  return rows.map((row) => validateProcessRow(row, requiredFields));
}

/**
 * Checks if all validation results are valid
 */
export function allProcessRowsValid(
  validationResults: Array<{ valid: boolean; errors: string[] }>,
): boolean {
  return validationResults.every((result) => result.valid);
}

/**
 * Gets validation errors in a structured format
 */
export function getProcessValidationErrors(
  validationResults: Array<{ valid: boolean; errors: string[] }>,
): Record<number, string[]> {
  const errors: Record<number, string[]> = {};

  validationResults.forEach((result, index) => {
    if (!result.valid) {
      errors[index] = result.errors;
    }
  });

  return errors;
}

/**
 * Imports processes from CSV rows
 * Requires that departments and grades already exist in the database
 * @param rows - Validated process CSV rows
 * @param companyId - Company ID for the processes
 * @param departmentMap - Map of department names to IDs (pre-validated)
 * @param gradeMap - Map of grade names/numbers to IDs (pre-validated)
 * @param prisma - Prisma client instance
 * @returns Import result with created count and errors
 */
export async function importProcesses(
  rows: ProcessImportRow[],
  companyId: string,
  departmentMap: Map<string, string>,
  gradeMap: Map<string | number, number>,
  prisma: PrismaClient,
): Promise<ProcessImportResult> {
  const result: ProcessImportResult = {
    success: true,
    created: 0,
    failed: 0,
    errors: [],
  };

  // Filter valid rows
  const validRows = rows.filter(
    (row) => row.title && String(row.title).trim() && row.plannedHours,
  );

  if (validRows.length === 0) {
    result.success = true;
    return result;
  }

  // Create processes in a transaction
  try {
    const createdProcesses = await prisma.$transaction(
      validRows.map((row, rowIndex) => {
        const title = String(row.title).trim();
        const description = row.description
          ? String(row.description).trim()
          : null;
        const plannedHours = Number(row.plannedHours);

        // Human-readable complexity fields (with defaults)
        const complexity = row.complexity
          ? String(row.complexity).trim().toLowerCase()
          : "standard";
        const businessImpact = row.businessImpact
          ? String(row.businessImpact).trim().toLowerCase()
          : "medium";
        const newness = row.newness
          ? String(row.newness).trim().toLowerCase()
          : "routine";
        const isBurningOut = row.isBurningOut
          ? String(row.isBurningOut).trim().toLowerCase() === "true"
          : false;

        const status = row.status
          ? String(row.status).trim().toLowerCase()
          : "open";

        // Resolve department ID
        const departmentName = String(row.department).trim();
        const departmentId = departmentMap.get(departmentName);

        if (!departmentId) {
          throw new Error(
            `[Row ${rowIndex + 1}] Department not found: "${departmentName}"`,
          );
        }

        // Resolve grade ID
        const gradeKey = isNaN(Number(row.targetGrade))
          ? String(row.targetGrade).trim()
          : Number(row.targetGrade);
        const gradeId = gradeMap.get(gradeKey);

        if (!gradeId) {
          throw new Error(
            `[Row ${rowIndex + 1}] Grade not found: "${row.targetGrade}"`,
          );
        }

        return prisma.process.create({
          data: {
            companyId,
            departmentId,
            title,
            description,
            plannedHours,
            complexity,
            businessImpact,
            newness,
            isBurningOut,
            targetGradeId: gradeId,
            status,
          },
        });
      }),
    );

    result.created = createdProcesses.length;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Try to extract row index from error message
    const rowMatch = message.match(/\[Row (\d+)\]/);
    const rowIndex = rowMatch ? parseInt(rowMatch[1], 10) - 1 : -1;

    result.success = false;
    result.failed = validRows.length;
    result.errors.push({
      rowIndex,
      process: rowIndex >= 0 ? validRows[rowIndex]?.title : "UNKNOWN",
      error: message,
    });
  }

  return result;
}
