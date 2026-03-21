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
  company: ["name"],
  role: ["role"],
  department: ["name"],
  process: ["title", "plannedHours", "targetGrade", "department"],
  finishedTasks: ["department", "process_name", "quantity"],
} as const;

/**
 * Optional fields per file type
 */
export const OPTIONAL_FIELDS_BY_TYPE = {
  employee: [
    "firstName",
    "lastName",
    "gender",
    "birthDate",
    "workingHoursPerDay",
    "kEfficiency",
  ],
  company: [
    "timezone",
    "description",
    "workingHoursDay",
    "workingDaysPerMonth",
  ],
  role: ["phone", "bio"],
  department: ["headName"],
  process: [
    "description",
    "complexity",
    "businessImpact",
    "newness",
    "isBurningOut",
    "status",
  ],
  finishedTasks: [
    "employee_name",
    "hoursSpent",
    "status",
    "completedAt",
    "date",
    "notes",
  ],
} as const;

/**
 * Sample column names for each file type (for UI hints)
 */
export const SAMPLE_COLUMNS_BY_TYPE = {
  employee: [
    "First Name",
    "Last Name",
    "FIRSTNAME",
    "LASTNAME",
    "Hire Date",
    "Department",
    "Grade",
    "Employment Type",
    "Status",
    "Gender",
    "Birth Date",
    "Working Hours Per Day",
    "K Efficiency",
  ],
  company: [
    "Company Name",
    "Timezone",
    "Description",
    "Working Hours Day",
    "Working Days Per Month",
  ],
  role: ["Role", "Phone", "Bio"],
  department: ["Department Name", "Head Name"],
  process: [
    "Process Title",
    "Planned Hours",
    "Target Grade",
    "Department",
    "Description",
    "Complexity",
    "Business Impact",
    "Newness",
    "Is Burning Out",
    "Status",
  ],
  finishedTasks: [
    "Department",
    "Process Name",
    "Quantity",
    "Employee Name",
    "Hours Spent",
    "Status",
    "Completed At",
    "Date",
    "Notes",
  ],
} as const;
