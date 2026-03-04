// ============================================================================
// Grade Repository
// ============================================================================
// Handles ALL database access for Grade domain
// ============================================================================

import type { Grade, Prisma } from "@/server/db/generated/prisma/client";

export class GradeRepository {
  constructor(private prisma: any) {} // Grade uses numeric id, not string

  protected readonly modelName = "grade" as const;

  // ==================== READ OPERATIONS ====================

  async findById(id: string): Promise<Grade | null> {
    return this.prisma.grade.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  async findMany(ids: readonly string[]): Promise<(Grade | null)[]> {
    const grades = await this.prisma.grade.findMany({
      where: { id: { in: ids.map((id) => parseInt(id, 10)) } },
    });
    return ids.map(
      (id) => grades.find((g: Grade) => g.id === parseInt(id, 10)) || null,
    );
  }

  async findAll(): Promise<Grade[]> {
    return this.prisma.grade.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findByName(name: string): Promise<Grade | null> {
    return this.prisma.grade.findFirst({
      where: { name },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.GradeCreateInput): Promise<Grade> {
    return this.prisma.grade.create({
      data,
    });
  }

  async update(id: string, data: Prisma.GradeUpdateInput): Promise<Grade> {
    return this.prisma.grade.update({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  async delete(id: string): Promise<Grade> {
    return this.prisma.grade.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  // ==================== RELATED QUERIES ====================

  async getEmployeeCount(gradeId: string): Promise<number> {
    return this.prisma.employee.count({
      where: { gradeId: parseInt(gradeId, 10) },
    });
  }
}
