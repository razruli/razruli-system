// ============================================================================
// TaskAssignment Repository
// ============================================================================

import type {
  TaskAssignment,
  Prisma,
} from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class TaskAssignmentRepository extends BaseRepository<TaskAssignment> {
  protected readonly modelName = "taskAssignment" as const;

  async findById(id: string): Promise<TaskAssignment | null> {
    return this.prisma.taskAssignment.findUnique({ where: { id } });
  }

  async findMany(ids: readonly string[]): Promise<(TaskAssignment | null)[]> {
    const items = await this.prisma.taskAssignment.findMany({
      where: { id: { in: ids as string[] } },
    });
    return (ids as string[]).map(
      (id) => items.find((t) => t.id === id) || null,
    );
  }

  async findByEmployee(employeeId: string): Promise<TaskAssignment[]> {
    return this.prisma.taskAssignment.findMany({
      where: { employeeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByCompany(companyId: string): Promise<TaskAssignment[]> {
    return this.prisma.taskAssignment.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByProcess(processId: string): Promise<TaskAssignment[]> {
    return this.prisma.taskAssignment.findMany({
      where: { processId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByDepartment(departmentId: string): Promise<TaskAssignment[]> {
    return this.prisma.taskAssignment.findMany({
      where: { departmentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAll(): Promise<TaskAssignment[]> {
    return this.prisma.taskAssignment.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    data: Prisma.TaskAssignmentCreateInput,
  ): Promise<TaskAssignment> {
    return this.prisma.taskAssignment.create({ data });
  }

  async update(
    id: string,
    data: Prisma.TaskAssignmentUpdateInput,
  ): Promise<TaskAssignment> {
    return this.prisma.taskAssignment.update({ where: { id }, data });
  }
}
