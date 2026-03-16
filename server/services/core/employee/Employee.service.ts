// ============================================================================
// Employee Service
// ============================================================================
// Business logic for Employee domain
// Uses EmployeeRepository for all DB access
// ============================================================================

import type { Employee } from "@/server/db/generated/prisma/client";
import {
  EmploymentType,
  Gender,
  EmployeeStatus,
} from "@/server/db/generated/prisma/client";
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
      data =
        data.filter((e) => e.firstName.toLowerCase().includes(searchLower)) ||
        data.filter((e) => e.lastName.toLowerCase().includes(searchLower));
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
    firstName: string;
    lastName: string;
    gradeId: number;
    gender: string;
    birthDate?: Date | null;
    hireDate: Date;
    employmentType?: string;
    workingHoursPerDay?: number;
    kEfficiency?: number;
  }): Promise<Employee> {
    this.log("info", `Creating employee`, {
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Validation
    this.validate(data.companyId, "Company ID required");
    this.validate(data.departmentId, "Department ID required");
    this.validate(data.firstName, "First name required");
    this.validate(data.lastName, "Last name required");
    this.validate(data.gradeId, "Grade ID required");

    // Check for duplicates
    const existing = await this.repository.findByCompanyAndName(
      data.companyId,
      data.firstName,
      data.lastName,
    );

    if (existing) {
      throw new ValidationError(
        `Employee "${data.firstName} ${data.lastName}" already exists in this company`,
      );
    }

    const employee = await this.repository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      gender: (data.gender as Gender) || Gender.OTHER,
      hireDate: data.hireDate,
      employmentType:
        (data.employmentType as EmploymentType) ||
        EmploymentType.LABOR_CONTRACT,
      company: { connect: { id: data.companyId } },
      department: { connect: { id: data.departmentId } },
      grade: { connect: { id: data.gradeId } },
      workingHoursPerDay: data.workingHoursPerDay || 8,
      kEfficiency: data.kEfficiency || 1.0,
      birthDate: data.birthDate || null,
      status: EmployeeStatus.ACTIVE,
    });

    this.log("info", `Employee created`, { id: employee.id });

    this.invalidateAll();

    return employee;
  }

  async update(
    id: string,
    data: Partial<{
      firstName?: string;
      lastName?: string;
      gradeId?: number;
      departmentId?: string;
      gender?: string;
      status?: string;
      kEfficiency?: number;
      workingHoursPerDay?: number;
      fireDate?: Date | null;
      birthDate?: Date | null;
      employmentType?: string;
    }>,
  ): Promise<Employee> {
    this.log("info", `Updating employee`, { id });

    await this.getByIdOrThrow(id);

    const updateData: any = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.gradeId !== undefined)
      updateData.grade = { connect: { id: data.gradeId } };
    if (data.departmentId !== undefined)
      updateData.department = { connect: { id: data.departmentId } };
    if (data.status !== undefined) updateData.status = data.status;
    if (data.kEfficiency !== undefined)
      updateData.kEfficiency = data.kEfficiency;
    if (data.workingHoursPerDay !== undefined)
      updateData.workingHoursPerDay = data.workingHoursPerDay;
    if (data.fireDate !== undefined) updateData.fireDate = data.fireDate;
    if (data.birthDate !== undefined) updateData.birthDate = data.birthDate;
    if (data.employmentType !== undefined)
      updateData.employmentType = data.employmentType;

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
      status: EmployeeStatus.TERMINATED,
      fireDate: new Date(),
    });

    this.invalidate(employeeId);
    this.invalidateAll();

    return updated;
  }

  /**
   * Create multiple employees in an atomic transaction
   * All succeed together or all fail if any validation error occurs
   * IMPORTANT: Validates ALL rows BEFORE transaction to ensure atomicity
   */
  async batchCreateFromRows(
    companyId: string,
    departmentMap: Map<string, string>, // departmentName -> departmentId
    gradeMap: Map<string, number>, // gradeName -> gradeId
    rows: Record<string, any>[],
  ): Promise<{
    created: number;
    failed: number;
    errors: Array<{ rowIndex: number; errors: string[] }>;
    employees: Employee[];
  }> {
    this.log("info", `Batch creating employees`, {
      companyId,
      rowCount: rows.length,
    });

    const validationErrors: Array<{ rowIndex: number; errors: string[] }> = [];

    try {
      // STEP 1: Validate all rows BEFORE transaction
      const validRows: Array<{ index: number; data: any }> = [];

      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const rowErrors: string[] = [];

        const departmentId = departmentMap.get(row.department);
        if (!departmentId) {
          rowErrors.push(`Department not found: ${row.department}`);
        }

        const gradeId = gradeMap.get(row.grade);
        if (!gradeId) {
          rowErrors.push(`Grade not found: ${row.grade}`);
        }

        if (rowErrors.length > 0) {
          validationErrors.push({ rowIndex: index, errors: rowErrors });
        } else {
          validRows.push({ index, data: row });
        }
      }

      // If any validation errors, fail immediately without touching DB
      if (validationErrors.length > 0) {
        this.log("warn", `Batch validation failed`, {
          failedCount: validationErrors.length,
        });
        return {
          created: 0,
          failed: validationErrors.length,
          errors: validationErrors,
          employees: [],
        };
      }

      // STEP 2: Execute transaction with only valid rows
      const employees = await this.context.prisma.$transaction(
        validRows.map(({ data }) =>
          this.context.prisma.employee.create({
            data: {
              companyId,
              departmentId: departmentMap.get(data.department)!,
              firstName: data.firstName,
              lastName: data.lastName,
              gradeId: gradeMap.get(data.grade)!,
              gender: (data.gender as Gender) || Gender.OTHER,
              birthDate: data.birthDate ? new Date(data.birthDate) : null,
              hireDate: new Date(data.hireDate),
              employmentType:
                (data.employmentType as EmploymentType) ||
                EmploymentType.LABOR_CONTRACT,
              status: (data.status as EmployeeStatus) || EmployeeStatus.ACTIVE,
              workingHoursPerDay: data.workingHoursPerDay
                ? parseInt(data.workingHoursPerDay, 10)
                : 8,
              kEfficiency: data.kEfficiency
                ? parseFloat(data.kEfficiency)
                : 1.0,
            },
          }),
        ),
      );

      this.log("info", `Batch creation completed`, {
        created: employees.length,
      });

      this.invalidateAll();

      return {
        created: employees.length,
        failed: 0,
        errors: [],
        employees,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.log("error", `Batch creation failed`, { error: message });

      // Transaction failed - all changes rolled back
      throw new Error(`Batch creation failed: ${message}`);
    }
  }
}
