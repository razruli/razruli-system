/**
 * Employee Entity Types
 * Extracted from GraphQL schema and Prisma models
 */

export interface Grade {
  id: number;
  name: string;
  kGrade: number;
  description?: string | null;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  headId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  companyId: string;
  departmentId: string;
  department?: Department;
  firstName: string;
  lastName: string;
  gradeId: number;
  grade?: Grade;
  gender: string;
  birthDate?: Date | null;
  hireDate: Date;
  fireDate?: Date | null;
  kEfficiency: number;
  employmentType: string;
  status: string;
  workingHoursPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeConnection {
  nodes: Employee[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface EmployeeFilterInput {
  companyId?: string;
  departmentId?: string;
  gradeId?: number;
  status?: string;
  search?: string;
}

export interface EmployeePaginationInput {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface CreateEmployeeInput {
  companyId: string;
  departmentId: string;
  firstName: string;
  lastName: string;
  gradeId: number;
  gender: string;
  hireDate: Date;
  birthDate?: Date | null;
  employmentType?: string;
  workingHoursPerDay?: number;
  kEfficiency?: number;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  gradeId?: number;
  departmentId?: string;
  gender?: string;
  status?: string;
  kEfficiency?: number;
  workingHoursPerDay?: number;
  birthDate?: Date | null;
  fireDate?: Date | null;
  employmentType?: string;
}
