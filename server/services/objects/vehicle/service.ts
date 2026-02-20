import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { VehicleRepository } from "./repository";
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleResponse,
} from "./types";
import { ValidationError } from "@/server/utils/errors/errors";

export class VehicleService extends BaseService {
  private repository: VehicleRepository;

  constructor(repository: VehicleRepository, loaders: LoaderRegistry) {
    super("VehicleService", loaders);
    this.repository = repository;
  }

  async getVehicle(id: string, _useBatching = true): Promise<VehicleResponse> {
    return this.executeQuery("getVehicle", async () => {
      const vehicle = await this.repository.findById(id);
      if (!vehicle) {
        throw new ValidationError(`Vehicle not found: ${id}`);
      }
      return vehicle;
    });
  }

  async listVehicles(skip = 0, take = 10): Promise<VehicleResponse[]> {
    return this.executeQuery("listVehicles", () =>
      this.repository.list(skip, take),
    );
  }

  async listVehiclesByCarrier(carrierId: string): Promise<VehicleResponse[]> {
    return this.executeQuery("listVehiclesByCarrier", () =>
      this.repository.listByCarrier(carrierId),
    );
  }

  async createVehicle(input: CreateVehicleInput): Promise<VehicleResponse> {
    return this.executeMutation("createVehicle", input, async () => {
      if (!input.vin || !input.licensePlate || !input.capacity) {
        throw new ValidationError(
          "vin, licensePlate, and capacity are required",
        );
      }
      return this.repository.create({
        ...input,
        status: "available",
      });
    });
  }

  async updateVehicle(
    id: string,
    input: UpdateVehicleInput,
  ): Promise<VehicleResponse> {
    return this.executeMutation("updateVehicle", input, async () => {
      return this.repository.update(id, input);
    });
  }

  async updateVehicleStatus(
    id: string,
    status: string,
  ): Promise<VehicleResponse> {
    return this.executeMutation(
      "updateVehicleStatus",
      { id, status },
      async () => {
        return this.repository.update(id, { status });
      },
    );
  }

  async deleteVehicle(id: string): Promise<void> {
    return this.executeMutation("deleteVehicle", { id }, async () => {
      await this.repository.delete(id);
    });
  }
}
