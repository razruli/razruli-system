import { z } from "zod";

/**
 * Column mapping from CSV column name to DB field
 */
export const ColumnMappingSchema = z.record(
  z.string(), // CSV column name
  z.string(), // DB field name
);

export type ColumnMapping = z.infer<typeof ColumnMappingSchema>;

/**
 * Required fields per file type
 */
export const REQUIRED_FIELDS_BY_TYPE = {
  employee: [
    "firstName",
    "lastName",
    "hireDate",
    "department",
    "grade",
    "employmentType",
    "status",
  ],
  company: ["name", "industry", "timezone"],
  role: ["name"],
  department: ["name"],
  process: ["title", "plannedHours", "targetGrade", "department"],
} as const;

/**
 * Optional fields per file type
 */
export const OPTIONAL_FIELDS_BY_TYPE = {
  employee: ["gender", "birthDate", "workingHoursPerDay", "kEfficiency"],
  company: [],
  role: [],
  department: [],
  process: [],
} as const;

/**
 * Sample column names for each file type (for UI hints)
 */
export const SAMPLE_COLUMNS_BY_TYPE = {
  employee: [
    "First Name",
    "Last Name",
    "Hire Date",
    "Department",
    "Grade",
    "Employment Type",
    "Status",
    "Gender",
    "Birth Date",
    "Working Hours",
    "Efficiency",
  ],
  company: ["Company Name", "Industry", "Timezone"],
  role: ["Role Name"],
  department: ["Department Name"],
  process: ["Process Title", "Planned Hours", "Target Grade", "Department"],
} as const;
