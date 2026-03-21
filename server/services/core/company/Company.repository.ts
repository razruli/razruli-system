// ============================================================================
// Company Repository
// ============================================================================
// Handles ALL database access for Company domain
// ============================================================================

import type { Company, Prisma } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class CompanyRepository extends BaseRepository<Company> {
  protected readonly modelName = "company" as const;

  // ==================== READ OPERATIONS ====================

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findByName(name: string): Promise<Company | null> {
    return this.prisma.company.findFirst({
      where: { name },
    });
  }

  async findBySlug(slug: string): Promise<Company | null> {
    console.warn(
      "[Company.repository.findBySlug] Querying database with slug:",
      {
        slug,
      },
    );
    const result = await this.prisma.company.findFirst({
      where: { slug },
    });
    console.warn("[Company.repository.findBySlug] Query result:", {
      found: !!result,
      resultId: result?.id,
      resultSlug: result?.slug,
    });
    return result;
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Company> {
    return this.prisma.company.delete({
      where: { id },
    });
  }

  // ==================== RELATED QUERIES ====================

  async getDepartmentCount(companyId: string): Promise<number> {
    return this.prisma.department.count({
      where: { companyId },
    });
  }

  async getEmployeeCount(companyId: string): Promise<number> {
    return this.prisma.employee.count({
      where: { companyId },
    });
  }
}
