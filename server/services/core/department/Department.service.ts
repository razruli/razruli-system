/**
 * ============================================================================
 * Department Service
 * ============================================================================
 * Business logic for Department domain
 * Uses DepartmentRepository for all DB access
 * ============================================================================
 */

import type { Department } from "@/server/db/generated/prisma/client";
import { BaseService, ValidationError } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { DepartmentRepository } from "./Department.repository";

/**
 * Department Service
 * Manages departments, reporting structure, and department-wide operations
 */
export class DepartmentService extends BaseService {
  readonly domain = "department";
  private repository: DepartmentRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new DepartmentRepository(context.prisma);
  }

  /**
   * Get department by ID
   */
  async getById(id: string): Promise<Department | null> {
    this.log("info", `Getting department by ID`, { id });
    const cacheKey = this.cacheKey(id);

    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Department> {
    const department = await this.getById(id);
    return this.ensureExists(department, "Department", id);
  }

  /**
   * Get all departments
   */
  async getAll(): Promise<Department[]> {
    const cacheKey = this.listCacheKey({});

    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  /**
   * Get departments by company
   */
  async getByCompanyId(companyId: string): Promise<Department[]> {
    const cacheKey = this.listCacheKey({ companyId });

    return this.getOrFetch(cacheKey, () =>
      this.repository.findByCompanyId(companyId),
    );
  }

  /**
   * Get departments by head
   */
  async getByHeadId(headId: string): Promise<Department[]> {
    return this.repository.findByHeadId(headId);
  }

  /**
   * Create department
   */
  async create(data: {
    name: string;
    companyId: string;
    headId?: string;
  }): Promise<Department> {
    this.log("info", `Creating department`, { name: data.name });

    this.validate(data.name, "Department name required");

    const department = await this.repository.create({
      name: data.name.trim(),
      companyId: data.companyId,
      headId: data.headId,
    });

    this.log("info", `Department created`, { id: department.id });

    this.invalidateAll();
    return department;
  }

  /**
   * Update department
   */
  async update(
    id: string,
    data: {
      name?: string;
      headId?: string | null;
    },
  ): Promise<Department> {
    this.log("info", `Updating department`, { id });

    await this.getByIdOrThrow(id);

    const updated = await this.repository.update(id, data);

    this.invalidate(id);
    this.invalidateAll();

    return updated;
  }

  /**
   * Delete department
   */
  async delete(id: string): Promise<Department> {
    this.log("info", `Deleting department`, { id });

    const department = await this.getByIdOrThrow(id);

    // Check if department has employees
    const employeeCount = await this.repository.getEmployeeCount(id);

    if (employeeCount > 0) {
      throw new ValidationError(
        `Cannot delete department with ${employeeCount} employees`,
      );
    }

    await this.repository.delete(id);

    this.log("info", `Department deleted`, { id });

    this.invalidate(id);
    this.invalidateAll();
    return department;
  }

  /**
   * Get department with all employees
   */
  async getWithEmployees(id: string) {
    const department = await this.getByIdOrThrow(id);
    const employees =
      await this.context.dataloaders.employeesByDepartment.load(id);

    return {
      ...department,
      employees,
    };
  }

  /**
   * Get employee count by department
   */
  async getEmployeeCount(id: string): Promise<number> {
    return this.repository.getEmployeeCount(id);
  }

  /**
   * Get many departments by IDs
   */
  async getMany(ids: string[]) {
    const department = await Promise.all(
      ids.map((id) => this.getById(id).catch(() => null)),
    );
    return department;
  }
}
