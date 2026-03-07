// ============================================================================
// Employee Service
// ============================================================================
// Business logic for Employee domain
// Uses EmployeeRepository for all DB access
// ============================================================================

import type { Employee } from "@/server/db/generated/prisma/client";
import { BaseService, ValidationError } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { EmployeeRepository } from "./Employee.repository";

export class EmployeeService extends BaseService {
  readonly domain = "employee";
  private repository: EmployeeRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new EmployeeRepository(context.prisma);
  }

  // ==================== READ OPERATIONS ====================

  async getById(id: string): Promise<Employee | null> {
    this.log("info", `Getting employee by ID`, { id });
    const cacheKey = this.cacheKey(id);

    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Employee> {
    const employee = await this.getById(id);
    return this.ensureExists(employee, "Employee", id);
  }

  async getByIds(ids: string[]): Promise<(Employee | null)[]> {
    if (ids.length === 0) return [];

    this.log("info", `Getting employees by IDs`, { count: ids.length });
    return this.repository.findMany(ids as readonly string[]);
  }

  async getByDepartment(departmentId: string): Promise<Employee[]> {
    this.log("info", `Getting employees by department`, { departmentId });

    const cacheKey = this.listCacheKey({ departmentId });

    return this.getOrFetch(cacheKey, () =>
      this.repository.findByDepartment(departmentId),
    );
  }

  async findByGrade(gradeId: number): Promise<Employee[]> {
    this.log("info", `Finding employees by grade`, { gradeId });

    const cacheKey = this.listCacheKey({ gradeId: gradeId.toString() });

    return this.getOrFetch(cacheKey, () =>
      this.repository.findByGrade(gradeId),
    );
  }

  async findByCompany(companyId: string): Promise<Employee[]> {
    this.log("info", `Finding employees by company`, { companyId });

    const cacheKey = this.listCacheKey({ companyId });

    return this.getOrFetch(cacheKey, () =>
      this.repository.findByCompany(companyId),
    );
  }

  async getAll(): Promise<Employee[]> {
    const cacheKey = this.listCacheKey({});

    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  async find(
    filters: {
      companyId?: string;
      departmentId?: string;
      gradeId?: number;
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
    data: Employee[];
    total: number;
    hasMore: boolean;
  }> {
    this.log("info", `Finding employees with filters`, { filters, pagination });

    const offset = pagination?.offset || 0;
    const limit = pagination?.limit || 20;

    // Find all matching employees
    const filterData: any = {};
    if (filters.companyId) filterData.companyId = filters.companyId;
    if (filters.departmentId) filterData.departmentId = filters.departmentId;
    if (filters.gradeId) filterData.gradeId = filters.gradeId;
    if (filters.status) filterData.status = filters.status;

    // For search, we'll need to filter in memory (simple implementation)
    let data = await this.repository.findByFilters({
      status: filters.status,
    });

    // Apply additional filters
    if (filters.companyId) {
      data = data.filter((e) => e.companyId === filters.companyId);
    }
    if (filters.departmentId) {
      data = data.filter((e) => e.departmentId === filters.departmentId);
    }
    if (filters.gradeId) {
      data = data.filter((e) => e.gradeId === filters.gradeId);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter((e) => e.fio.toLowerCase().includes(searchLower));
    }

    const total = data.length;
    const paginatedData = data.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      data: paginatedData,
      total,
      hasMore,
    };
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    companyId: string;
    departmentId: string;
    fio: string;
    gradeId: number;
    gender: string;
    birthDate?: Date | null;
    hireDate: Date;
    employmentType?: string;
    workingHoursPerDay?: number;
    kEfficiency?: number;
  }): Promise<Employee> {
    this.log("info", `Creating employee`, { fio: data.fio });

    // Validation
    this.validate(data.companyId, "Company ID required");
    this.validate(data.departmentId, "Department ID required");
    this.validate(data.fio, "Full name required");
    this.validate(data.gradeId, "Grade ID required");

    // Check for duplicates
    const existing = await this.repository.findByCompanyAndName(
      data.companyId,
      data.fio,
    );

    if (existing) {
      throw new ValidationError(
        `Employee "${data.fio}" already exists in this company`,
      );
    }

    const employee = await this.repository.create({
      fio: data.fio,
      gender: data.gender,
      hireDate: data.hireDate,
      employmentType: data.employmentType || "full-time",
      company: { connect: { id: data.companyId } },
      department: { connect: { id: data.departmentId } },
      grade: { connect: { id: data.gradeId } },
    });

    this.log("info", `Employee created`, { id: employee.id });

    this.invalidateAll();

    return employee;
  }

  async update(
    id: string,
    data: Partial<{
      fio: string;
      gradeId: number;
      departmentId: string;
      gender: string;
      status?: string;
      kEfficiency?: number;
      workingHoursPerDay?: number;
      fireDate?: Date;
    }>,
  ): Promise<Employee> {
    this.log("info", `Updating employee`, { id });

    await this.getByIdOrThrow(id);

    const updateData: any = {};

    if (data.fio) updateData.fio = data.fio;
    if (data.gender) updateData.gender = data.gender;
    if (data.gradeId) updateData.grade = { connect: { id: data.gradeId } };
    if (data.departmentId)
      updateData.department = { connect: { id: data.departmentId } };
    if (data.status !== undefined) updateData.status = data.status;
    if (data.kEfficiency !== undefined)
      updateData.kEfficiency = data.kEfficiency;
    if (data.workingHoursPerDay !== undefined)
      updateData.workingHoursPerDay = data.workingHoursPerDay;
    if (data.fireDate !== undefined) updateData.fireDate = data.fireDate;

    const updated = await this.repository.update(id, updateData);

    this.invalidate(id);
    this.invalidateAll();

    return updated;
  }

  // ==================== BUSINESS LOGIC ====================

  async search(filters: { status?: string }): Promise<Employee[]> {
    this.log("info", `Searching employees`, { filters });

    const cacheKey = this.listCacheKey(filters);

    return this.getOrFetch(cacheKey, () =>
      this.repository.findByFilters(filters),
    );
  }

  async calculateCapacity(employeeId: string): Promise<number> {
    this.log("info", `Calculating capacity for employee`, { employeeId });

    const employee = await this.getByIdOrThrow(employeeId);

    // Base capacity units per month
    // This is a simplified calculation - adjust based on your business logic
    const baseCapacityUnits = 100; // CUs per month for grade 0
    const gradeMultiplier = 1 + employee.gradeId * 0.1; // Each grade adds 10%
    const kEfficiency = employee.kEfficiency || 1.0;

    const monthlyCapacity = baseCapacityUnits * gradeMultiplier * kEfficiency;

    return monthlyCapacity;
  }

  async calculateLoadIndex(
    employeeId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<number> {
    this.log("info", `Calculating load index for employee`, {
      employeeId,
      periodStart,
      periodEnd,
    });

    // Verify employee exists
    await this.getByIdOrThrow(employeeId);

    // Get total capacity for the period
    const _capacity = await this.calculateCapacity(employeeId);
    const _daysInPeriod = Math.ceil(
      (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24),
    );
    // TODO: Use periodCapacity when task assignment filtering is implemented
    // const periodCapacity = (_capacity / 30) * _daysInPeriod; // Normalize to period

    // Get all task assignments in the period
    // TODO: Implement task assignment filtering by date range
    // For now, return a default load index
    const defaultLoadIndex = 50; // 50% load

    return defaultLoadIndex;
  }

  async dismiss(employeeId: string): Promise<Employee> {
    this.log("info", `Dismissing employee`, { employeeId });

    // Verify employee exists
    await this.getByIdOrThrow(employeeId);

    const updated = await this.repository.update(employeeId, {
      status: "dismissed",
      fireDate: new Date(),
    });

    this.invalidate(employeeId);
    this.invalidateAll();

    return updated;
  }
}
