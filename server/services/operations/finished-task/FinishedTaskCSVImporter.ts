/**
 * Finished Task CSV Importer
 * Validates and imports task completion records from CSV
 * Supports both department-level and employee-level tracking
 *
 * CSV Format:
 * department, process_name, quantity, [employee_name], [hoursSpent], [status], [completedAt], [notes]
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";

export interface FinishedTaskImportRow {
  department: string; // Required
  process_name: string; // Required - matches Process.title
  quantity: string | number; // Required - how many completed
  employee_name?: string; // Optional - "FirstName LastName"
  hoursSpent?: string | number; // Optional - actual hours spent
  status?: string; // Optional - default "COMPLETED"
  completedAt?: string; // Optional - YYYY-MM-DD, defaults to today
  date?: string; // Alternative name for completedAt
  notes?: string; // Optional - free-form notes
  [key: string]: any;
}

export interface FinishedTaskValidationResult {
  valid: boolean;
  row?: any; // Normalized row if valid
  errors: string[];
}

/**
 * Parse date string, default to today if not provided
 */
function parseCompletedDate(dateStr?: string): Date {
  if (!dateStr || (typeof dateStr === "string" && dateStr.trim() === "")) {
    return new Date();
  }

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date format: ${dateStr} (expected YYYY-MM-DD)`);
  }

  return parsed;
}

/**
 * Parse quantity as positive integer
 */
function parseQuantity(qty: string | number): number {
  const parsed = parseInt(String(qty).trim(), 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`Quantity must be positive integer, got: ${qty}`);
  }
  return parsed;
}

/**
 * Parse hours spent as positive float (optional)
 */
function parseHours(hours?: string | number): number | null {
  if (!hours || (typeof hours === "string" && hours.trim() === "")) {
    return null;
  }

  const parsed = parseFloat(String(hours).trim());
  if (isNaN(parsed) || parsed < 0) {
    throw new Error(`Hours must be non-negative number, got: ${hours}`);
  }

  return parsed;
}

/**
 * Validates a single finished task row with database lookups
 * @param row - Raw CSV row
 * @param companyId - Company ID
 * @param prisma - Prisma client for lookups
 * @returns Validation result with normalized row
 */
export async function validateFinishedTaskRow(
  row: Record<string, any>,
  companyId: string,
  prisma: PrismaClient,
): Promise<FinishedTaskValidationResult> {
  const errors: string[] = [];

  // Extract and validate required fields
  const department = String(row.department || "").trim();
  const process_name = String(row.process_name || "").trim();
  const quantity = row.quantity;

  if (!department) {
    return { valid: false, errors: ["Missing required field: department"] };
  }

  if (!process_name) {
    return { valid: false, errors: ["Missing required field: process_name"] };
  }

  if (quantity === undefined || quantity === null || quantity === "") {
    return { valid: false, errors: ["Missing required field: quantity"] };
  }

  // Validate and parse quantity
  let quantityParsed = 0;
  try {
    quantityParsed = parseQuantity(quantity);
  } catch (e) {
    return {
      valid: false,
      errors: [`${(e as Error).message}`],
    };
  }

  // Lookup department
  const deptRecord = await prisma.department.findFirst({
    where: {
      companyId,
      name: department,
    },
  });

  if (!deptRecord) {
    return {
      valid: false,
      errors: [
        `Department not found: "${department}" (must be imported first)`,
      ],
    };
  }

  // Lookup process
  const processRecord = await prisma.process.findFirst({
    where: {
      companyId,
      title: process_name,
    },
  });

  if (!processRecord) {
    return {
      valid: false,
      errors: [`Process not found: "${process_name}" (must be imported first)`],
    };
  }

  // Parse optional fields
  let completedAt = new Date();
  try {
    completedAt = parseCompletedDate(row.completedAt || row.date);
  } catch (e) {
    errors.push(`${(e as Error).message}`);
  }

  let hoursSpent: number | null = null;
  try {
    hoursSpent = parseHours(row.hoursSpent);
  } catch (e) {
    errors.push(`${(e as Error).message}`);
  }

  const status = String(row.status || "COMPLETED")
    .trim()
    .toUpperCase();
  const notes = row.notes ? String(row.notes).trim() : null;

  // Optional: lookup employee if provided
  let employeeId: string | null = null;
  const employee_name = row.employee_name
    ? String(row.employee_name).trim()
    : null;

  if (employee_name) {
    const parts = employee_name.split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    if (!firstName || !lastName) {
      errors.push(
        `Employee name must be "FirstName LastName", got: "${employee_name}"`,
      );
    } else {
      const employeeRecord = await prisma.employee.findFirst({
        where: {
          companyId,
          departmentId: deptRecord.id,
          firstName,
          lastName,
        },
      });

      if (!employeeRecord) {
        errors.push(
          `Employee not found: "${employee_name}" in department "${department}"`,
        );
      } else {
        employeeId = employeeRecord.id;
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return normalized row ready for database insertion
  return {
    valid: true,
    row: {
      companyId,
      departmentId: deptRecord.id,
      processId: processRecord.id,
      employeeId,
      quantity: quantityParsed,
      completedAt,
      hoursSpent,
      status,
      notes,
    },
    errors: [],
  };
}

/**
 * Validates all rows in a batch
 */
export async function validateFinishedTaskRows(
  rows: FinishedTaskImportRow[],
  companyId: string,
  prisma: PrismaClient,
): Promise<FinishedTaskValidationResult[]> {
  const results: FinishedTaskValidationResult[] = [];

  for (const row of rows) {
    const result = await validateFinishedTaskRow(row, companyId, prisma);
    results.push(result);
  }

  return results;
}

export function allFinishedTaskRowsValid(
  results: FinishedTaskValidationResult[],
): boolean {
  return results.every((r) => r.valid);
}

export function getFinishedTaskValidationErrors(
  results: FinishedTaskValidationResult[],
): Array<{ row: number; errors: string[] }> {
  return results
    .map((result, idx) => ({
      row: idx + 2, // Row number in CSV (1-indexed + header)
      errors: result.errors,
    }))
    .filter((item) => item.errors.length > 0);
}

/**
 * Import finished tasks to database
 * @param rows - Validated and normalized rows
 * @param prisma - Prisma client
 * @returns Import result with count and any errors
 */
export async function importFinishedTasks(
  rows: any[], // Pre-validated rows with all required fields
  prisma: PrismaClient,
): Promise<{
  success: boolean;
  count: number;
  errors: string[];
}> {
  try {
    const createdTasks = await prisma.$transaction(
      rows.map((row) =>
        prisma.finishedTask.create({
          data: row,
        }),
      ),
    );

    return {
      success: true,
      count: createdTasks.length,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}
