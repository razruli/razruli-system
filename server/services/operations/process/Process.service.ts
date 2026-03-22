// ============================================================================
// Process Service
// ============================================================================

import type { Process, Prisma } from "@/server/db/generated/prisma/client";
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

  async findByDepartment(departmentId: string): Promise<Process[]> {
    return this.getByDepartment(departmentId);
  }

  async findByCompany(companyId: string): Promise<Process[]> {
    const cacheKey = this.listCacheKey({ companyId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByCompany(companyId),
    );
  }

  async findByGrade(gradeId: number): Promise<Process[]> {
    const cacheKey = this.listCacheKey({ gradeId: gradeId.toString() });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByGrade(gradeId),
    );
  }

  async getAll(): Promise<Process[]> {
    const cacheKey = this.listCacheKey({});
    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  async find(
    filters?: {
      companyId?: string;
      status?: string;
      search?: string;
    },
    pagination?: {
      offset?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "ASC" | "DESC";
    },
  ): Promise<{
    data: Process[];
    total: number;
    hasMore: boolean;
  }> {
    this.log("info", `Finding processes with filters`, { filters, pagination });

    const offset = pagination?.offset || 0;
    const limit = pagination?.limit || 20;
    const sortBy = pagination?.sortBy || "createdAt";
    const sortOrder = pagination?.sortOrder || "ASC";

    // Build Prisma filter object
    const where: Prisma.ProcessWhereInput = {};
    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.search) {
      where.title = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    // Build sort object dynamically
    const orderBy: Record<string, any> = {};
    orderBy[sortBy] = sortOrder.toLowerCase();

    // Query database with filters, sorting, and pagination
    const [data, total] = await Promise.all([
      this.context.prisma.process.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
      }),
      this.context.prisma.process.count({ where }),
    ]);

    const hasMore = offset + limit < total;

    return {
      data,
      total,
      hasMore,
    };
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    companyId: string;
    departmentId: string;
    title: string;
    description?: string;
    plannedHours: number;
    complexity?: string;
    businessImpact?: string;
    newness?: string;
    isBurningOut?: boolean;
    targetGradeId: number;
    status?: string;
  }): Promise<Process> {
    this.log("info", `Creating process`, { title: data.title });

    // Validation
    this.validate(data.title, "Process title required");
    this.validate(data.companyId, "Company ID required");
    this.validate(data.departmentId, "Department ID required");
    this.validate(data.plannedHours, "Planned hours required");
    this.validate(data.targetGradeId, "Target grade ID required");

    const process = await this.repository.create({
      title: data.title,
      description: data.description,
      company: { connect: { id: data.companyId } },
      department: { connect: { id: data.departmentId } },
      plannedHours: data.plannedHours,
      complexity: data.complexity || "standard",
      businessImpact: data.businessImpact || "medium",
      newness: data.newness || "routine",
      isBurningOut: data.isBurningOut ?? false,
      status: data.status || "open",
      targetGrade: { connect: { id: data.targetGradeId } },
      weight: null, // TODO: Calculate weight from complexity factors
    });

    this.log("info", `Process created`, {
      id: process.id,
      title: process.title,
    });
    this.invalidateAll();

    return process;
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      plannedHours: number;
      complexity: string;
      businessImpact: string;
      newness: string;
      isBurningOut: boolean;
      targetGradeId: number;
    }>,
  ): Promise<Process> {
    this.log("info", `Updating process`, { id });

    const updated = await this.repository.update(id, data);

    this.log("info", `Process updated`, { id });
    this.invalidate(id);

    return updated;
  }

  async delete(id: string): Promise<Process> {
    this.log("info", `Deleting process`, { id });

    const deleted = await this.repository.delete(id);

    this.log("info", `Process deleted`, { id });
    this.invalidateAll();

    return deleted;
  }

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
