// ============================================================================
// LoadSnapshot Repository
// ============================================================================
// Handles ALL database access for LoadSnapshot domain
// ============================================================================

import type { LoadSnapshot, Prisma } from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";
import type {
  FilterInput,
  PaginationInput,
  PaginatedResult,
} from "@/server/services/base/pagination";

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

  /**
   * Find load snapshots with filtering and pagination
   */
  async find(
    filter?: FilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedResult<LoadSnapshot>> {
    return this.findWithPagination(filter, pagination);
  }

  // ==================== SPECIFIC QUERIES ====================

  async findByEmployee(employeeId: string): Promise<LoadSnapshot[]> {
    return this.prisma.loadSnapshot.findMany({
      where: { employeeId },
      orderBy: { periodStart: "desc" },
    });
  }

  async findByCompany(companyId: string): Promise<LoadSnapshot[]> {
    return this.prisma.loadSnapshot.findMany({
      where: { companyId },
      orderBy: { periodStart: "desc" },
    });
  }

  async findByDepartment(departmentId: string): Promise<LoadSnapshot[]> {
    return this.prisma.loadSnapshot.findMany({
      where: { departmentId },
      orderBy: { periodStart: "desc" },
    });
  }

  async findByProcess(processId: string): Promise<LoadSnapshot[]> {
    // LoadSnapshot doesn't directly reference Process, so we find it through
    // TaskAssignments - get all task assignments for the process,
    // then find LoadSnapshots for those employees/departments
    const taskAssignments = await this.prisma.taskAssignment.findMany({
      where: { processId },
      select: { employeeId: true, departmentId: true },
    });

    const employeeIds = [
      ...new Set(taskAssignments.map((ta) => ta.employeeId)),
    ];
    const departmentIds = [
      ...new Set(taskAssignments.map((ta) => ta.departmentId)),
    ];

    if (employeeIds.length === 0 && departmentIds.length === 0) {
      return [];
    }

    return this.prisma.loadSnapshot.findMany({
      where: {
        OR: [
          { employeeId: { in: employeeIds } },
          { departmentId: { in: departmentIds } },
        ],
      },
      orderBy: { periodStart: "desc" },
    });
  }

  async findByTaskAssignmentId(
    taskAssignmentId: string,
  ): Promise<LoadSnapshot[]> {
    // Find the task assignment to get employee and department info
    const taskAssignment = await this.prisma.taskAssignment.findUnique({
      where: { id: taskAssignmentId },
      select: { employeeId: true, departmentId: true },
    });

    if (!taskAssignment) {
      return [];
    }

    // Find LoadSnapshots for this employee or department
    return this.prisma.loadSnapshot.findMany({
      where: {
        OR: [
          { employeeId: taskAssignment.employeeId },
          { departmentId: taskAssignment.departmentId },
        ],
      },
      orderBy: { periodStart: "desc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.LoadSnapshotCreateInput): Promise<LoadSnapshot> {
    return this.prisma.loadSnapshot.create({ data });
  }
}
