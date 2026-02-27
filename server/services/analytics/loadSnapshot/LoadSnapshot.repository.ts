// ============================================================================
// LoadSnapshot Repository
// ============================================================================
// Handles ALL database access for LoadSnapshot domain
// ============================================================================

import type { LoadSnapshot, Prisma } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class LoadSnapshotRepository extends BaseRepository<LoadSnapshot> {
  protected readonly modelName = "loadSnapshot" as const;

  // ==================== READ OPERATIONS ====================

  async findById(id: string): Promise<LoadSnapshot | null> {
    return this.prisma.loadSnapshot.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<LoadSnapshot[]> {
    return this.prisma.loadSnapshot.findMany();
  }

  async findByEmployee(employeeId: string): Promise<LoadSnapshot[]> {
    return this.prisma.loadSnapshot.findMany({
      where: { employeeId },
      orderBy: { snapshotDate: "desc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.LoadSnapshotCreateInput): Promise<LoadSnapshot> {
    return this.prisma.loadSnapshot.create({ data });
  }
}
