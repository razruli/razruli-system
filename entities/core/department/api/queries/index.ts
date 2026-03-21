/**
 * Department Query Documents & Hooks
 *
 * Usage:
 * import { GetDepartmentsDocument } from '@/entities/core/department/api/queries';
 * import { GetDepartmentDocument } from '@/entities/core/department/api/queries';
 */

export {
  GetDepartmentDocument,
  GetDepartmentsDocument,
  GetDepartmentWithMetricsDocument,
} from "@/shared/graphql/generated";
export * from "./hooks";
