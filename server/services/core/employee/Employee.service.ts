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

  async getAll(): Promise<Employee[]> {
    const cacheKey = this.listCacheKey({});

    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    companyId: string;
    departmentId: string;
    fio: string;
    gradeId: number;
    gender: string;
    hireDate: Date;
    employmentType?: string;
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
    if (data.status) updateData.status = data.status;
    if (data.kEfficiency) updateData.kEfficiency = data.kEfficiency;

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

  async dismiss(employeeId: string): Promise<Employee> {
    this.log("info", `Dismissing employee`, { employeeId });

    const employee = await this.getByIdOrThrow(employeeId);

    const updated = await this.repository.update(employeeId, {
      status: "dismissed",
    });

    this.invalidate(employeeId);
    this.invalidateAll();

    return updated;
  }
}
