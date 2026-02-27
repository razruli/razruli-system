// ============================================================================
// Department Repository
// ============================================================================
// Handles ALL database access for Department domain
// ============================================================================

import type { Department } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class DepartmentRepository extends BaseRepository<Department> {
  protected readonly modelName = "department" as const;

  // ==================== READ OPERATIONS ====================

  async findAll(): Promise<Department[]> {
    return this.prisma.department.findMany({
      include: {
        company: true,
        head: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(
    id: string,
    includeRelations = true,
  ): Promise<Department | null> {
    return this.prisma.department.findUnique({
      where: { id },
      include: includeRelations
        ? {
            company: true,
            head: true,
          }
        : undefined,
    });
  }

  async findByCompanyId(companyId: string): Promise<Department[]> {
    return this.prisma.department.findMany({
      where: { companyId },
      include: { head: true },
      orderBy: { name: "asc" },
    });
  }

  async findByHeadId(headId: string): Promise<Department[]> {
    return this.prisma.department.findMany({
      where: { headId },
      orderBy: { name: "asc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    name: string;
    companyId: string;
    headId?: string;
  }): Promise<Department> {
    return this.prisma.department.create({
      data: {
        name: data.name,
        companyId: data.companyId,
        headId: data.headId,
      },
      include: {
        company: true,
        head: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      headId?: string | null;
    },
  ): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data: {
        name: data.name ? data.name.trim() : undefined,
        headId: data.headId !== undefined ? data.headId : undefined,
      },
      include: {
        company: true,
        head: true,
      },
    });
  }

  async delete(id: string): Promise<Department> {
    return this.prisma.department.delete({
      where: { id },
    });
  }

  // ==================== RELATED QUERIES ====================

  async getEmployeeCount(departmentId: string): Promise<number> {
    return this.prisma.employee.count({
      where: { departmentId },
    });
  }
}
