// ============================================================================
// EmployeeHistory Service
// ============================================================================
// Business logic for EmployeeHistory domain (immutable audit log)
// ============================================================================

import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";
import type {
  FilterInput,
  PaginationInput,
  PaginatedResult,
} from "@/server/services/base/pagination";

import { EmployeeHistoryRepository } from "./EmployeeHistory.repository";

export class EmployeeHistoryService extends BaseService {
  readonly domain = "employeeHistory";
  private repository: EmployeeHistoryRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new EmployeeHistoryRepository(context.prisma);
  }

  async getById(id: string) {
    const cacheKey = this.cacheKey(id);
    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByEmployee(employeeId: string) {
    const cacheKey = this.listCacheKey({ employeeId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByEmployee(employeeId),
    );
  }

  async getAll() {
    const cacheKey = this.listCacheKey({});
    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  /**
   * Find employee histories with filtering and pagination
   */
  async find(
    filter?: FilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedResult<any>> {
    const filterKey = filter ? JSON.stringify(filter) : "none";
    const paginationKey = pagination
      ? `${pagination.skip || 0}-${pagination.take || 20}`
      : "0-20";
    const cacheKey = this.queryCacheKey(`find:${filterKey}:${paginationKey}`);

    return this.getOrFetch(cacheKey, () =>
      this.repository.find(filter, pagination),
    );
  }

  async create(data: any) {
    const item = await this.repository.create(data);
    this.invalidateAll();
    return item;
  }

  // ==================== HISTORY TRACKING METHODS ====================

  async recordHire(
    employeeId: string,
    _departmentId: string,
    _gradeId: number,
    _hireDate: Date,
  ) {
    this.log("info", `Recording hire for employee`, { employeeId });

    const item = await this.repository.create({
      employee: { connect: { id: employeeId } },
      fieldName: "status",
      oldValue: null,
      newValue: "active",
      changedBy: this.context.userId || "system",
      changedAt: new Date(),
      reason: "Hire",
    });

    this.invalidateAll();
    return item;
  }

  async recordGradeChange(
    employeeId: string,
    oldGradeId: number,
    newGradeId: number,
  ) {
    this.log("info", `Recording grade change for employee`, { employeeId });

    const item = await this.repository.create({
      employee: { connect: { id: employeeId } },
      fieldName: "gradeId",
      oldValue: oldGradeId.toString(),
      newValue: newGradeId.toString(),
      changedBy: this.context.userId || "system",
      changedAt: new Date(),
      reason: `Grade change from ${oldGradeId} to ${newGradeId}`,
    });

    this.invalidateAll();
    return item;
  }

  async recordTransfer(
    employeeId: string,
    oldDepartmentId: string,
    newDepartmentId: string,
  ) {
    this.log("info", `Recording department transfer for employee`, {
      employeeId,
    });

    const item = await this.repository.create({
      employee: { connect: { id: employeeId } },
      fieldName: "departmentId",
      oldValue: oldDepartmentId,
      newValue: newDepartmentId,
      changedBy: this.context.userId || "system",
      changedAt: new Date(),
      reason: `Transfer from department ${oldDepartmentId} to ${newDepartmentId}`,
    });

    this.invalidateAll();
    return item;
  }

  async recordDismissal(
    employeeId: string,
    dismissalDate: Date,
    reason?: string,
  ) {
    this.log("info", `Recording dismissal for employee`, { employeeId });

    const item = await this.repository.create({
      employee: { connect: { id: employeeId } },
      fieldName: "status",
      oldValue: "active",
      newValue: "dismissed",
      changedBy: this.context.userId || "system",
      changedAt: dismissalDate,
      reason: reason || "Dismissal",
    });

    this.invalidateAll();
    return item;
  }

  async recordFire(
    employeeId: string,
    departmentId: string,
    gradeId: number,
    fireDate: Date,
    reason: string,
    changedBy: string,
  ) {
    this.log("info", `Recording fire/dismissal for employee`, { employeeId });

    const item = await this.repository.create({
      employee: { connect: { id: employeeId } },
      fieldName: "fireDate",
      oldValue: null,
      newValue: fireDate.toISOString(),
      changedBy: changedBy || "system",
      changedAt: fireDate,
      reason: reason || "Employee termination",
    });

    this.invalidateAll();
    return item;
  }

  async recordEfficiencyUpdate(
    employeeId: string,
    oldValue: number,
    newValue: number,
    changedBy: string,
  ) {
    this.log("info", `Recording efficiency update for employee`, {
      employeeId,
    });

    const item = await this.repository.create({
      employee: { connect: { id: employeeId } },
      fieldName: "kEfficiency",
      oldValue: oldValue.toString(),
      newValue: newValue.toString(),
      changedBy: changedBy || "system",
      changedAt: new Date(),
      reason: `Efficiency coefficient updated from ${oldValue} to ${newValue}`,
    });

    this.invalidateAll();
    return item;
  }

  async getEmployeeHistory(employeeId: string) {
    this.log("info", `Getting history for employee`, { employeeId });

    const cacheKey = this.listCacheKey({ employeeId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByEmployee(employeeId),
    );
  }

  async findByEmployee(employeeId: string) {
    return this.getEmployeeHistory(employeeId);
  }
}
