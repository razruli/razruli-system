// ============================================================================
// EmployeeHistory Repository
// ============================================================================
// Handles ALL database access for EmployeeHistory domain
// ============================================================================

import type {
  EmployeeHistory,
  Prisma,
} from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class EmployeeHistoryRepository extends BaseRepository<EmployeeHistory> {
  protected readonly modelName = "employeeHistory" as const;

  // ==================== READ OPERATIONS ====================

  async findByEmployee(employeeId: string): Promise<EmployeeHistory[]> {
    return this.prisma.employeeHistory.findMany({
      where: { employeeId },
    });
  }

  async findAll(): Promise<EmployeeHistory[]> {
    return this.prisma.employeeHistory.findMany();
  }

  // ==================== WRITE OPERATIONS ====================

  async create(
    data: Prisma.EmployeeHistoryCreateInput,
  ): Promise<EmployeeHistory> {
    return this.prisma.employeeHistory.create({ data });
  }
}
