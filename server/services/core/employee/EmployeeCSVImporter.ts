/**
 * Employee CSV Importer
 * Validates and imports employee records from CSV before database insertion
 * Handles language mapping (Russian → English) for enum fields
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";
import {
  normalizeEmploymentType,
  normalizeGender,
  normalizeStatus,
  parseFullName,
  parseDate,
  parseInt,
  parseFloat,
} from "@/server/utils/dataProcessing/languageMapping";

export interface EmployeeImportRow {
  firstName?: string;
  lastName?: string;
  hireDate: string;
  birthDate?: string;
  employmentType?: string;
  status?: string;
  gender?: string;
  workingHoursPerDay?: string | number;
  kEfficiency?: string | number;
  department: string;
  grade: string | number;
  [key: string]: any;
}

export interface EmployeeValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a single employee row
 * Normalizes and validates all fields
 * @param row - Raw CSV row
 * @param companyId - Company ID for lookups
 * @param requiredFields - Fields that must be present
 * @param prisma - Prisma client for database validation
 * @returns Validation result with errors
 */
export async function validateEmployeeRow(
  row: Record<string, any>,
  companyId: string,
  requiredFields: string[],
  prisma: PrismaClient,
): Promise<EmployeeValidationResult> {
  const errors: string[] = [];

  // Check required fields exist
  for (const field of requiredFields) {
    if (
      !row[field] ||
      (typeof row[field] === "string" && row[field].trim() === "")
    ) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate firstName and lastName (required - can come from separate columns or split from fio)
  let firstName = "";
  let lastName = "";

  if (row.firstName !== undefined && row.lastName !== undefined) {
    // Separate columns
    firstName = String(row.firstName).trim();
    lastName = String(row.lastName).trim();
  } else if (row.fio) {
    // Legacy support: split combined "ФИО" field
    try {
      const parsed = parseFullName(row.fio);
      firstName = parsed.firstName;
      lastName = parsed.lastName;
    } catch (e) {
      errors.push(`${(e as Error).message}`);
      return { valid: false, errors };
    }
  }

  if (!firstName || firstName === "") {
    errors.push("First name (firstName) is required");
  }

  // Validate hireDate
  try {
    parseDate(row.hireDate, "hireDate");
  } catch (e) {
    errors.push(`${(e as Error).message}`);
  }

  // Validate birthDate if present (optional)
  if (row.birthDate) {
    try {
      parseDate(row.birthDate, "birthDate");
    } catch (e) {
      errors.push(`${(e as Error).message}`);
    }
  }

  // Validate employment type (with language mapping)
  try {
    if (row.employmentType) {
      normalizeEmploymentType(row.employmentType);
    }
  } catch (e) {
    errors.push(`${(e as Error).message}`);
  }

  // Validate status (with language mapping)
  try {
    if (row.status) {
      normalizeStatus(row.status);
    }
  } catch (e) {
    errors.push(`${(e as Error).message}`);
  }

  // Validate gender if present (with language mapping)
  try {
    if (row.gender) {
      normalizeGender(row.gender);
    }
  } catch (e) {
    errors.push(`${(e as Error).message}`);
  }

  // Validate working hours per day (optional, 1-24)
  if (row.workingHoursPerDay) {
    try {
      parseInt(row.workingHoursPerDay, "workingHoursPerDay", 1, 24);
    } catch (e) {
      errors.push(`${(e as Error).message}`);
    }
  }

  // Validate kEfficiency (optional, 0.1-2.0)
  if (row.kEfficiency) {
    try {
      parseFloat(row.kEfficiency, "kEfficiency", 0.1, 2.0);
    } catch (e) {
      errors.push(`${(e as Error).message}`);
    }
  }

  // Check department exists
  if (row.department) {
    const department = await prisma.department.findFirst({
      where: {
        companyId,
        name: row.department,
      },
    });

    if (!department) {
      errors.push(`Department not found: ${row.department}`);
    }
  }

  // Check grade exists (grade can be either ID or name like 'Junior', 'Senior', etc.)
  if (row.grade) {
    let grade = null;
    const gradeValue = String(row.grade).trim();

    // Try to find by numeric ID first (check if it's a number)
    const gradeId = Number(gradeValue);
    if (!isNaN(gradeId) && gradeId > 0 && Number.isInteger(gradeId)) {
      grade = await prisma.grade.findUnique({
        where: { id: gradeId },
      });
    }

    // If not found by ID, try to find by name (e.g., 'Junior', 'Senior', 'Middle', 'Lead')
    if (!grade) {
      grade = await prisma.grade.findFirst({
        where: { name: gradeValue },
      });
    }

    if (!grade) {
      errors.push(
        `Invalid grade: "${gradeValue}". Please use an existing grade name or ID`,
      );
    }
  }

  // Check for duplicate employee in company (unique constraint: companyId, firstName, lastName)
  if (firstName && lastName) {
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        companyId,
        firstName: { equals: firstName, mode: "insensitive" },
        lastName: { equals: lastName, mode: "insensitive" },
      },
    });

    if (existingEmployee) {
      errors.push(
        `Employee already exists in company: ${firstName} ${lastName}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates all employee rows
 * @param rows - Array of CSV rows
 * @param companyId - Company ID for lookups
 * @param requiredFields - Fields that must be present
 * @param prisma - Prisma client for database validation
 * @returns Array of validation results mapped by row index
 */
export async function validateEmployeeRows(
  rows: Record<string, any>[],
  companyId: string,
  requiredFields: string[],
  prisma: PrismaClient,
): Promise<Array<EmployeeValidationResult>> {
  const results: EmployeeValidationResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = await validateEmployeeRow(
      rows[i],
      companyId,
      requiredFields,
      prisma,
    );
    results.push(result);
  }

  return results;
}

/**
 * Checks if all validation results are valid
 * @param validationResults - Array of validation results
 * @returns True if all rows are valid
 */
export function allEmployeeRowsValid(
  validationResults: Array<EmployeeValidationResult>,
): boolean {
  return validationResults.every((result) => result.valid);
}

/**
 * Gets validation errors in a structured format
 * @param validationResults - Array of validation results
 * @returns Object mapping row index to error arrays
 */
export function getEmployeeValidationErrors(
  validationResults: Array<EmployeeValidationResult>,
): Record<number, string[]> {
  const errors: Record<number, string[]> = {};

  validationResults.forEach((result, index) => {
    if (!result.valid) {
      errors[index] = result.errors;
    }
  });

  return errors;
}
