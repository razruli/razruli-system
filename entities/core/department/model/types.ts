/**
 * Department Entity Types
 * Extracted from GraphQL schema and Prisma models
 */

export interface Company {
  id: string;
  name: string;
  timezone: string;
  workingHoursDay: number;
  workingDaysPerMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: number;
  name: string;
  kGrade: number;
}

export interface EmployeeHead {
  id: string;
  gradeId: number;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  headId?: string | null;
  head?: EmployeeHead;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentConnection {
  nodes: Department[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface DepartmentMetrics {
  department: Department;
  totalEmployees: number;
  activeEmployees: number;
  overloadedCount: number;
  totalCapacity: number;
  totalLoad: number;
  loadIndex: number;
}

export interface DepartmentFilterInput {
  companyId: string;
  search?: string;
}

export interface CreateDepartmentInput {
  companyId: string;
  name: string;
  headId?: string | null;
}

export interface UpdateDepartmentInput {
  name?: string;
  headId?: string | null;
}
