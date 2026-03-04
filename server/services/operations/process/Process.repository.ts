// ============================================================================
// Process Repository
// ============================================================================

import type { Process, Prisma } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class ProcessRepository extends BaseRepository<Process> {
  protected readonly modelName = "process" as const;

  async findById(id: string): Promise<Process | null> {
    return this.prisma.process.findUnique({ where: { id } });
  }

  async findMany(ids: readonly string[]): Promise<(Process | null)[]> {
    const items = await this.prisma.process.findMany({
      where: { id: { in: ids as string[] } },
    });
    return (ids as string[]).map(
      (id) => items.find((p) => p.id === id) || null,
    );
  }

  async findByDepartment(departmentId: string): Promise<Process[]> {
    return this.prisma.process.findMany({
      where: { departmentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByCompany(companyId: string): Promise<Process[]> {
    return this.prisma.process.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByGrade(gradeId: number): Promise<Process[]> {
    return this.prisma.process.findMany({
      where: { targetGradeId: gradeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll(): Promise<Process[]> {
    return this.prisma.process.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.ProcessCreateInput): Promise<Process> {
    return this.prisma.process.create({ data });
  }

  async update(id: string, data: Prisma.ProcessUpdateInput): Promise<Process> {
    return this.prisma.process.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Process> {
    return this.prisma.process.delete({ where: { id } });
  }

  async getTaskCount(processId: string): Promise<number> {
    return this.prisma.taskAssignment.count({
      where: { processId },
    });
  }
}
