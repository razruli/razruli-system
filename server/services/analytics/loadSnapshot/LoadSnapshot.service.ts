// ============================================================================
// LoadSnapshot Service
// ============================================================================
// Business logic for LoadSnapshot domain
// ============================================================================

import { BaseService } from "@/server/services/base";
import type {
  FilterInput,
  PaginationInput,
  PaginatedResult,
} from "@/server/services/base/pagination";
import type { ServiceContext } from "@/server/types/context";

import { LoadSnapshotRepository } from "./LoadSnapshot.repository";

export class LoadSnapshotService extends BaseService {
  readonly domain = "loadSnapshot";
  private repository: LoadSnapshotRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new LoadSnapshotRepository(context.prisma);
  }

  async getById(id: string) {
    const cacheKey = this.cacheKey(id);
    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getAll() {
    const cacheKey = this.listCacheKey({});
    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  /**
   * Find load snapshots with filtering and pagination
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

  // ==================== SPECIFIC QUERIES ====================

  async findByEmployee(employeeId: string) {
    const cacheKey = this.listCacheKey({ employeeId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByEmployee(employeeId),
    );
  }

  async findByCompany(companyId: string) {
    const cacheKey = this.listCacheKey({ companyId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByCompany(companyId),
    );
  }

  async findByDepartment(departmentId: string) {
    const cacheKey = this.listCacheKey({ departmentId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByDepartment(departmentId),
    );
  }

  async findByProcess(processId: string) {
    const cacheKey = this.listCacheKey({ processId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByProcess(processId),
    );
  }

  async findByTaskAssignmentId(taskAssignmentId: string) {
    const cacheKey = this.listCacheKey({ taskAssignmentId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByTaskAssignmentId(taskAssignmentId),
    );
  }

  async create(data: any) {
    const item = await this.repository.create(data);
    this.invalidateAll();
    return item;
  }
}
