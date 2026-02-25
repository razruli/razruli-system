// ============================================================================
// Employee Repository
// ============================================================================
// Handles ALL database access for Employee domain
// ============================================================================

import type { Employee, Prisma } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class EmployeeRepository extends BaseRepository<Employee> {
  protected readonly modelName = "employee" as const;

  // ==================== READ OPERATIONS ====================

  async findById(id: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async findMany(ids: readonly string[]): Promise<(Employee | null)[]> {
    const employees = await this.prisma.employee.findMany({
      where: { id: { in: ids as string[] } },
    });
    return (ids as string[]).map(
      (id) => employees.find((e) => e.id === id) || null,
    );
  }

  async findByDepartment(departmentId: string): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { departmentId },
      orderBy: { fio: "asc" },
    });
  }

  async findByCompanyAndName(
    companyId: string,
    fio: string,
  ): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: {
        companyId_fio: {
          companyId,
          fio,
        },
      },
    });
  }

  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      orderBy: { fio: "asc" },
    });
  }

  async findByFilters(filters: { status?: string }): Promise<Employee[]> {
    const where: Prisma.EmployeeWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    return this.prisma.employee.findMany({
      where,
      orderBy: { fio: "asc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.EmployeeUpdateInput,
  ): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Employee> {
    return this.prisma.employee.delete({
      where: { id },
    });
  }

  // ==================== RELATED QUERIES ====================

  async getTaskAssignmentCount(employeeId: string): Promise<number> {
    return this.prisma.taskAssignment.count({
      where: { employeeId },
    });
  }

  async getHistoryCount(employeeId: string): Promise<number> {
    return this.prisma.employeeHistory.count({
      where: { employeeId },
    });
  }
}
