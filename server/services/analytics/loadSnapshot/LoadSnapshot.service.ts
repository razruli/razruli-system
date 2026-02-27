// ============================================================================
// LoadSnapshot Service
// ============================================================================
// Business logic for LoadSnapshot domain
// ============================================================================

import { BaseService } from "@/server/services/base";
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

  async findByEmployee(employeeId: string) {
    const cacheKey = this.listCacheKey({ employeeId });
    return this.getOrFetch(cacheKey, () =>
      this.repository.findByEmployee(employeeId),
    );
  }

  async create(data: any) {
    const item = await this.repository.create(data);
    this.invalidateAll();
    return item;
  }
}
