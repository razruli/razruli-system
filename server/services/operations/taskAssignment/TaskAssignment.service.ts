// ============================================================================
// TaskAssignment Service
// ============================================================================

import type { TaskAssignment } from "@/server/db/generated/prisma/client";
import type { ServiceContext } from "@/server/types/context";

import { BaseService } from "../../base";

import { TaskAssignmentRepository } from "./TaskAssignment.repository";

export class TaskAssignmentService extends BaseService {
  readonly domain = "taskAssignment";
  private repository: TaskAssignmentRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new TaskAssignmentRepository(context.prisma);
  }

  async getById(id: string): Promise<TaskAssignment | null> {
    const cacheKey = this.cacheKey(id);
    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<TaskAssignment> {
    const item = await this.getById(id);
    return this.ensureExists(item, "TaskAssignment", id);
  }

  async getByEmployee(employeeId: string): Promise<TaskAssignment[]> {
    const cacheKey = this.listCacheKey({ employeeId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByEmployee(employeeId),
    );
  }

  async findByEmployee(employeeId: string): Promise<TaskAssignment[]> {
    return this.getByEmployee(employeeId);
  }

  async findByCompany(companyId: string): Promise<TaskAssignment[]> {
    const cacheKey = this.listCacheKey({ companyId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByCompany(companyId),
    );
  }

  async findByProcess(processId: string): Promise<TaskAssignment[]> {
    const cacheKey = this.listCacheKey({ processId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByProcess(processId),
    );
  }

  async findByDepartment(departmentId: string): Promise<TaskAssignment[]> {
    const cacheKey = this.listCacheKey({ departmentId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByDepartment(departmentId),
    );
  }

  async getAll(): Promise<TaskAssignment[]> {
    const cacheKey = this.listCacheKey({});
    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  async create(data: {
    processId: string;
    employeeId: string;
    companyId: string;
    departmentId: string;
    plannedHours: number;
  }): Promise<TaskAssignment> {
    this.validate(data.processId, "Process ID required");
    this.validate(data.employeeId, "Employee ID required");

    const item = await this.repository.create({
      process: { connect: { id: data.processId } },
      employee: { connect: { id: data.employeeId } },
      company: { connect: { id: data.companyId } },
      department: { connect: { id: data.departmentId } },
      plannedHours: data.plannedHours,
      status: "pending",
    });

    this.invalidateAll();
    return item;
  }

  async updateStatus(
    id: string,
    status: "pending" | "in_progress" | "completed",
  ): Promise<TaskAssignment> {
    await this.getByIdOrThrow(id);
    const item = await this.repository.update(id, { status });
    this.invalidate(id);
    this.invalidateAll();
    return item;
  }

  async cancelByEmployee(employeeId: string): Promise<number> {
    this.log("info", `Canceling all active task assignments for employee`, {
      employeeId,
    });

    // Get all active assignments for the employee
    const assignments = await this.getByEmployee(employeeId);
    const activeAssignments = assignments.filter(
      (a) => a.status === "pending" || a.status === "in_progress",
    );

    // Cancel each one
    for (const assignment of activeAssignments) {
      await this.updateStatus(assignment.id, "completed");
    }

    this.invalidateAll();
    return activeAssignments.length;
  }
}
