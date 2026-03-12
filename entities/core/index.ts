/**
 * Core Domain Entities
 *
 * Includes employee, department, company, and grade entities with their
 * corresponding hooks for queries and mutations.
 *
 * Usage:
 * import { useGetEmployee, useCreateDepartment } from '@/entities/core/employee';
 * import { useGetDepartments } from '@/entities/core/department';
 * import type { Employee, Department } from '@/entities/core/employee/model';
 */

export * as employee from "./employee";
export * as department from "./department";
