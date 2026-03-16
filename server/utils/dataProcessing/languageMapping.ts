/**
 * Language mapping and normalization utilities
 * Handles Russian → English enum conversions for CSV imports
 * Supports case-insensitive input matching
 */

export type EmploymentType =
  | "LABOR_CONTRACT"
  | "SERVICE_CONTRACT"
  | "SELF_EMPLOYED";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

/**
 * Map Russian employment types to English enums
 * ТД (трудовой договор) → LABOR_CONTRACT
 * ГПХ (гражданско-правовой договор) → SERVICE_CONTRACT
 * Самозанятый → SELF_EMPLOYED
 */
const EMPLOYMENT_TYPE_MAP: Record<string, EmploymentType> = {
  // Russian abbreviations
  ТД: "LABOR_CONTRACT",
  ГПХ: "SERVICE_CONTRACT",
  САМОЗАНЯТЫЙ: "SELF_EMPLOYED",
  // English variants
  LABOR_CONTRACT: "LABOR_CONTRACT",
  SERVICE_CONTRACT: "SERVICE_CONTRACT",
  SELF_EMPLOYED: "SELF_EMPLOYED",
  LABOUR_CONTRACT: "LABOR_CONTRACT",
  CONTRACT: "LABOR_CONTRACT",
  LABOUR: "LABOR_CONTRACT",
  LABOR: "LABOR_CONTRACT",
  SERVICE: "SERVICE_CONTRACT",
  GIG: "SERVICE_CONTRACT",
  FREELANCE: "SERVICE_CONTRACT",
};

/**
 * Map gender values to enum
 * М (Мужчина) → MALE
 * Ж (Женщина) → FEMALE
 */
const GENDER_MAP: Record<string, Gender> = {
  // Russian Cyrillic
  М: "MALE",
  Ж: "FEMALE",
  // English short
  M: "MALE",
  F: "FEMALE",
  // English long
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
  // Russian long
  МУЖЧИНА: "MALE",
  ЖЕНЩИНА: "FEMALE",
};

/**
 * Map status values to enum
 */
const STATUS_MAP: Record<string, EmployeeStatus> = {
  // English lowercase
  active: "ACTIVE",
  inactive: "INACTIVE",
  on_leave: "ON_LEAVE",
  "on leave": "ON_LEAVE",
  terminated: "TERMINATED",
  // English uppercase
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ON_LEAVE: "ON_LEAVE",
  TERMINATED: "TERMINATED",
  // Russian variants
  АКТИВНЫЙ: "ACTIVE",
  АКТИВНА: "ACTIVE",
  НЕАКТИВНЫЙ: "INACTIVE",
  НЕАКТИВНА: "INACTIVE",
  НА_ОТПУСКЕ: "ON_LEAVE",
  В_ОТПУСКЕ: "ON_LEAVE",
  ОТПУСК: "ON_LEAVE",
  УВОЛЕН: "TERMINATED",
  УВОЛЕНА: "TERMINATED",
};

/**
 * Normalize employment type - accepts Russian or English input
 * Returns uppercase enum value or throws error
 */
export function normalizeEmploymentType(value: unknown): EmploymentType {
  if (!value) throw new Error("Employment type is required");

  const str = String(value).trim().toUpperCase();
  const normalized = EMPLOYMENT_TYPE_MAP[str];

  if (!normalized) {
    throw new Error(
      `Invalid employment type: "${value}". ` +
        `Accepted values: ТД, ГПХ, Самозанятый, LABOR_CONTRACT, SERVICE_CONTRACT, SELF_EMPLOYED`,
    );
  }

  return normalized;
}

/**
 * Normalize gender - accepts Russian or English input
 * Returns uppercase enum value or throws error
 */
export function normalizeGender(value: unknown): Gender {
  if (!value) return "OTHER"; // Gender is optional, default to OTHER

  const str = String(value).trim().toUpperCase();
  const normalized = GENDER_MAP[str];

  if (!normalized) {
    throw new Error(
      `Invalid gender: "${value}". ` +
        `Accepted values: М, Ж, M, F, MALE, FEMALE, OTHER`,
    );
  }

  return normalized;
}

/**
 * Normalize employee status - accepts Russian or English input
 * Returns uppercase enum value or throws error
 */
export function normalizeStatus(value: unknown): EmployeeStatus {
  if (!value) throw new Error("Status is required");

  const str = String(value).trim().toUpperCase();
  const normalized = STATUS_MAP[str];

  if (!normalized) {
    throw new Error(
      `Invalid status: "${value}". ` +
        `Accepted values: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED ` +
        `(or Russian: АКТИВНЫЙ, НЕАКТИВНЫЙ, НА ОТПУСКЕ, УВОЛЕН)`,
    );
  }

  return normalized;
}

/**
 * Parse full name (Russian or English)
 * "Иван Петров" → { firstName: "Иван", lastName: "Петров" }
 * "John Smith" → { firstName: "John", lastName: "Smith" }
 * "Иван" → { firstName: "Иван", lastName: "" } (single name)
 */
export function parseFullName(fullName: unknown): {
  firstName: string;
  lastName: string;
} {
  if (!fullName) {
    throw new Error("Full name is required");
  }

  const str = String(fullName).trim();
  if (str.length === 0) {
    throw new Error("Full name cannot be empty");
  }

  const parts = str.split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    };
  }

  // First word is firstName, rest is lastName
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Parse a date string in YYYY-MM-DD format
 * Validates the date is valid
 */
export function parseDate(value: unknown, fieldName: string = "date"): Date {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }

  const str = String(value).trim();
  const date = new Date(str);

  if (isNaN(date.getTime())) {
    throw new Error(
      `Invalid ${fieldName} format: "${value}". Expected YYYY-MM-DD`,
    );
  }

  return date;
}

/**
 * Parse integer value
 */
export function parseInt(
  value: unknown,
  fieldName: string = "number",
  min?: number,
  max?: number,
): number {
  if (value === null || value === undefined || value === "") {
    throw new Error(`${fieldName} is required`);
  }

  const num = Number.parseInt(String(value), 10);

  if (isNaN(num)) {
    throw new Error(`Invalid ${fieldName}: "${value}". Must be a number`);
  }

  if (min !== undefined && num < min) {
    throw new Error(`${fieldName} must be at least ${min}, got ${num}`);
  }

  if (max !== undefined && num > max) {
    throw new Error(`${fieldName} must be at most ${max}, got ${num}`);
  }

  return num;
}

/**
 * Parse float/decimal value
 */
export function parseFloat(
  value: unknown,
  fieldName: string = "number",
  min?: number,
  max?: number,
): number {
  if (value === null || value === undefined || value === "") {
    throw new Error(`${fieldName} is required`);
  }

  const num = Number.parseFloat(String(value));

  if (isNaN(num)) {
    throw new Error(`Invalid ${fieldName}: "${value}". Must be a number`);
  }

  if (min !== undefined && num < min) {
    throw new Error(`${fieldName} must be at least ${min}, got ${num}`);
  }

  if (max !== undefined && num > max) {
    throw new Error(`${fieldName} must be at most ${max}, got ${num}`);
  }

  return num;
}

/**
 * Validate string is non-empty
 */
export function validateString(
  value: unknown,
  fieldName: string = "field",
  maxLength: number = 255,
): string {
  if (!value || String(value).trim() === "") {
    throw new Error(`${fieldName} is required`);
  }

  const str = String(value).trim();

  if (str.length > maxLength) {
    throw new Error(
      `${fieldName} exceeds maximum length of ${maxLength} characters`,
    );
  }

  return str;
}

/**
 * Normalize a string value for comparison (lowercase, trim)
 */
export function normalizeString(value: unknown): string {
  return String(value).trim().toLowerCase();
}
