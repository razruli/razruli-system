import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { DriverRepository } from "./repository";
import { DriverResponse } from "./types";

export class DriverService extends BaseService {
  private repository: DriverRepository;
  constructor(repository: DriverRepository, loaders: LoaderRegistry) {
    super("DriverService", loaders);
    this.repository = repository;
  }
  async getDriver(id: string): Promise<DriverResponse | null> {
    return this.executeQuery("getDriver", () => this.repository.findById(id));
  }
  async listDrivers(skip = 0, take = 10): Promise<DriverResponse[]> {
    return this.executeQuery("listDrivers", () =>
      this.repository.list(skip, take),
    );
  }
  async listDriversByCarrier(carrierId: string): Promise<DriverResponse[]> {
    return this.executeQuery("listDriversByCarrier", () =>
      this.repository.listByCarrier(carrierId),
    );
  }
  async createDriver(input: any): Promise<DriverResponse> {
    return this.executeMutation("createDriver", input, () =>
      this.repository.create(input),
    );
  }
  async updateDriver(id: string, input: any): Promise<DriverResponse> {
    return this.executeMutation("updateDriver", input, () =>
      this.repository.update(id, input),
    );
  }
  async updateDriverStatus(
    id: string,
    status: string,
  ): Promise<DriverResponse> {
    return this.executeMutation("updateDriverStatus", { status }, () =>
      this.repository.update(id, { status }),
    );
  }
}
