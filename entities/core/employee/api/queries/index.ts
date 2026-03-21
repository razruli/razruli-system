/**
 * Employee Query Documents & Hooks
 *
 * Usage:
 * import { GetEmployeesDocument } from '@/entities/core/employee/api/queries';
 * import { GetEmployeeDocument } from '@/entities/core/employee/api/queries';
 */

export {
  GetEmployeeDocument,
  GetEmployeesDocument,
  GetDepartmentEmployeesDocument,
  GetEmployeeCapacityDocument,
  GetEmployeeLoadIndexDocument,
} from "@/shared/graphql/generated";
export * from "./hooks";
