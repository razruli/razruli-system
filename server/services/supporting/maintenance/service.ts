import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { MaintenanceRepository } from "./repository";
import { MaintenanceResponse } from "./types";
export class MaintenanceService extends BaseService {
  private repository: MaintenanceRepository;
  constructor(repository: MaintenanceRepository, loaders: LoaderRegistry) {
    super("MaintenanceService", loaders);
    this.repository = repository;
  }
  async getMaintenance(
    id: string,
    _useBatching = true,
  ): Promise<MaintenanceResponse> {
    return this.executeQuery("getMaintenance", () =>
      this.repository.findById(id),
    );
  }
  async listMaintenance(skip = 0, take = 10): Promise<MaintenanceResponse[]> {
    return this.executeQuery("listMaintenance", () =>
      this.repository.list(skip, take),
    );
  }
  async createMaintenance(input: any): Promise<MaintenanceResponse> {
    return this.executeMutation("createMaintenance", input, () =>
      this.repository.create(input),
    );
  }
  async updateMaintenance(
    id: string,
    input: any,
  ): Promise<MaintenanceResponse> {
    return this.executeMutation("updateMaintenance", input, () =>
      this.repository.update(id, input),
    );
  }
}
