/**
 * Process CSV Importer
 * Imports business process records from CSV and creates them in the database
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";

export interface ProcessImportRow {
  title: string;
  description?: string;
  plannedHours: string | number;
  kBurn?: string | number;
  kCrit?: string | number;
  kNew?: string | number;
  targetGrade: string | number;
  department: string;
  status?: string;
  priority?: string;
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

  // Validate kBurn, kCrit, kNew - must be valid floats (optional)
  for (const field of ["kBurn", "kCrit", "kNew"]) {
    if (
      row[field] !== undefined &&
      row[field] !== null &&
      String(row[field]).trim() !== ""
    ) {
      const value = Number(row[field]);
      if (isNaN(value)) {
        errors.push(`${field} must be a valid number`);
      } else if (value < 0 || value > 5) {
        errors.push(`${field} must be between 0 and 5`);
      }
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

  // Validate priority - should be valid priority value (optional)
  if (row.priority && String(row.priority).trim()) {
    const priority = String(row.priority).trim().toLowerCase();
    const validPriorities = ["low", "medium", "high", "critical"];
    if (!validPriorities.includes(priority)) {
      errors.push(
        `priority must be one of: ${validPriorities.join(", ")} (got: ${row.priority})`,
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
        const kBurn = row.kBurn ? Number(row.kBurn) : 0.0;
        const kCrit = row.kCrit ? Number(row.kCrit) : 0.0;
        const kNew = row.kNew ? Number(row.kNew) : 0.0;
        const status = row.status
          ? String(row.status).trim().toLowerCase()
          : "open";
        const priority = row.priority
          ? String(row.priority).trim().toLowerCase()
          : "medium";

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
            kBurn,
            kCrit,
            kNew,
            targetGradeId: gradeId,
            status,
            priority,
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
