/**
 * Department CSV Importer
 * Imports department records from CSV and creates them in the database
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";

export interface DepartmentImportRow {
  name: string;
  headName?: string; // Optional: "FirstName LastName" format for department head resolution
  [key: string]: any;
}

export interface DepartmentImportResult {
  success: boolean;
  created: number;
  failed: number;
  errors: Array<{
    rowIndex: number;
    department: string;
    error: string;
  }>;
}

/**
 * Validates a single department row
 * @param row - Raw CSV row
 * @param requiredFields - Fields that must be present
 * @returns Validation result with errors
 */
export function validateDepartmentRow(
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

  // Validate name is not empty and is string
  if (row.name) {
    const name = String(row.name).trim();
    if (name.length < 2) {
      errors.push("Department name must be at least 2 characters");
    }
    if (name.length > 255) {
      errors.push("Department name must not exceed 255 characters");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates all department rows
 * @param rows - Array of CSV rows
 * @param requiredFields - Fields that must be present
 * @returns Array of validation results
 */
export function validateDepartmentRows(
  rows: DepartmentImportRow[],
  requiredFields: string[],
): Array<{ valid: boolean; errors: string[] }> {
  return rows.map((row) => validateDepartmentRow(row, requiredFields));
}

/**
 * Checks if all validation results are valid
 */
export function allDepartmentRowsValid(
  validationResults: Array<{ valid: boolean; errors: string[] }>,
): boolean {
  return validationResults.every((result) => result.valid);
}

/**
 * Gets validation errors in a structured format
 */
export function getDepartmentValidationErrors(
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
 * Imports departments from CSV rows
 * @param rows - Validated department CSV rows
 * @param companyId - Company ID for the departments
 * @param prisma - Prisma client instance
 * @returns Import result with created count and errors
 */
export async function importDepartments(
  rows: DepartmentImportRow[],
  companyId: string,
  prisma: PrismaClient,
): Promise<DepartmentImportResult> {
  const result: DepartmentImportResult = {
    success: true,
    created: 0,
    failed: 0,
    errors: [],
  };

  // Filter out rows with validation errors (should already be validated)
  const validRows = rows.filter((row) => row.name && String(row.name).trim());

  if (validRows.length === 0) {
    result.success = true;
    return result;
  }

  // Create departments in a transaction
  try {
    const createdDepartments = await prisma.$transaction(
      validRows.map((row) => {
        const name = String(row.name).trim();

        return prisma.department.upsert({
          where: {
            companyId_name: {
              companyId,
              name,
            },
          } as any,
          update: {}, // No updates, just return existing
          create: {
            companyId,
            name,
            // headId will be set separately after employees are created
            // since we need to resolve the head name to employee ID
          },
        });
      }),
    );

    result.created = createdDepartments.filter((d) => d).length;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.success = false;
    result.failed = validRows.length;
    result.errors.push({
      rowIndex: -1,
      department: "ALL",
      error: `Batch creation failed: ${message}`,
    });
  }

  return result;
}

/**
 * Resolves department heads by matching employee names
 * Called after employees are created to set department heads
 * @param departmentHeadMap - Map of department name to head name
 * @param companyId - Company ID
 * @param prisma - Prisma client instance
 * @returns Result with updated count and errors
 */
export async function resolveDepartmentHeads(
  departmentHeadMap: Map<string, string>,
  companyId: string,
  prisma: PrismaClient,
): Promise<{
  updated: number;
  errors: Array<{ department: string; error: string }>;
}> {
  const result = {
    updated: 0,
    errors: [] as Array<{ department: string; error: string }>,
  };

  for (const [deptName, headName] of departmentHeadMap.entries()) {
    try {
      if (!headName || headName.trim() === "") {
        continue; // Skip empty head names
      }

      // Try to find employee by first/last name combination
      const nameParts = headName.trim().split(/\s+/);
      if (nameParts.length < 2) {
        result.errors.push({
          department: deptName,
          error: `Invalid head name format: "${headName}" (expected: "FirstName LastName")`,
        });
        continue;
      }

      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const employee = await prisma.employee.findFirst({
        where: {
          companyId,
          firstName,
          lastName,
        },
      });

      if (!employee) {
        result.errors.push({
          department: deptName,
          error: `Employee not found: "${headName}"`,
        });
        continue;
      }

      // Update department with head
      await prisma.department.update({
        where: {
          companyId_name: {
            companyId,
            name: deptName,
          },
        } as any,
        data: {
          headId: employee.id,
        },
      });

      result.updated++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push({
        department: deptName,
        error: message,
      });
    }
  }

  return result;
}
