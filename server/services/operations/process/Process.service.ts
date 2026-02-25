// ============================================================================
// Process Service
// ============================================================================

import type { Process } from "@/server/db/generated/prisma/client";
import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { ProcessRepository } from "./Process.repository";

export class ProcessService extends BaseService {
  readonly domain = "process";
  private repository: ProcessRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new ProcessRepository(context.prisma);
  }

  async getById(id: string): Promise<Process | null> {
    const cacheKey = this.cacheKey(id);
    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Process> {
    const item = await this.getById(id);
    return this.ensureExists(item, "Process", id);
  }

  async getByDepartment(departmentId: string): Promise<Process[]> {
    const cacheKey = this.listCacheKey({ departmentId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByDepartment(departmentId),
    );
  }

  async getAll(): Promise<Process[]> {
    const cacheKey = this.listCacheKey({});
    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  //   async create(data: { title: string; departmentId: string }): Promise<Process> {
  //     this.validate(data.title, 'Title required');
  //     this.validate(data.departmentId, 'Department ID required');

  //     const item = await this.repository.create({
  //       title: data.title,
  //       department: { connect: { id: data.departmentId } },
  //       company: { connect: { id: 'default-company-id' } },
  //       plannedHours: 0,
  //       targetGrade: 1,
  //     });

  //     this.invalidateAll();
  //     return item;
  //   }

  async getWithStats(id: string) {
    const item = await this.getByIdOrThrow(id);
    const taskCount = await this.repository.getTaskCount(id);

    return { ...item, stats: { tasks: taskCount } };
  }

  async assignWithCapacityCheck(
    processId: string,
    employeeId: string,
    load: number = 10, // Default load in CUs
  ) {
    this.log("info", `Assigning process to employee with capacity check`, {
      processId,
      employeeId,
      load,
    });

    // Validate process exists
    const process = await this.getByIdOrThrow(processId);

    // Validate employee exists
    const employee = await this.context.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    this.ensureExists(employee, "Employee", employeeId);

    // Calculate employee's available capacity
    const gradeMultiplier = 1 + employee!.gradeId * 0.1;
    const kEfficiency = employee!.kEfficiency || 1.0;
    const monthlyCapacity = 100 * gradeMultiplier * kEfficiency;

    // Get employee's current load
    const existingTasks = await this.context.prisma.taskAssignment.findMany({
      where: { employeeId },
    });

    const currentLoad = existingTasks.reduce(
      (sum, t) => sum + (t.calculatedLoad || 0),
      0,
    );
    const availableCapacity = monthlyCapacity - currentLoad;
    const plannedHours = load * 2; // Rough conversion: 1 CU ≈ 2 hours
    const isOverloaded = availableCapacity < load;

    // Get company for context
    const companyId = process.companyId;

    // Create task assignment
    const taskAssignment = await this.context.prisma.taskAssignment.create({
      data: {
        processId,
        employeeId,
        departmentId: employee!.departmentId,
        companyId,
        plannedHours,
        calculatedLoad: load as any,
        status: "assigned",
        createdAt: new Date(),
      },
    });

    this.invalidateAll();

    return {
      taskId: taskAssignment.id,
      load: plannedHours,
      isOverloaded,
      availableCapacity,
    };
  }
}
