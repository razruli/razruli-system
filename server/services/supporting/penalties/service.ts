import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { PenaltiesRepository } from "./repository";
import { PenaltiesResponse } from "./types";
export class PenaltiesService extends BaseService {
  private repository: PenaltiesRepository;
  constructor(repository: PenaltiesRepository, loaders: LoaderRegistry) {
    super("PenaltiesService", loaders);
    this.repository = repository;
  }
  async getPenalties(
    id: string,
    _useBatching = true,
  ): Promise<PenaltiesResponse> {
    return this.executeQuery("getPenalties", () =>
      this.repository.findById(id),
    );
  }
  async listPenalties(skip = 0, take = 10): Promise<PenaltiesResponse[]> {
    return this.executeQuery("listPenalties", () =>
      this.repository.list(skip, take),
    );
  }
  async createPenalties(input: any): Promise<PenaltiesResponse> {
    return this.executeMutation("createPenalties", input, () =>
      this.repository.create(input),
    );
  }
  async updatePenalties(id: string, input: any): Promise<PenaltiesResponse> {
    return this.executeMutation("updatePenalties", input, () =>
      this.repository.update(id, input),
    );
  }

  // Resolver compatibility methods
  async getCancellationFee(shipmentId: string): Promise<any> {
    return this.executeQuery("getCancellationFee", () => Promise.resolve({})); // Placeholder
  }

  async listCancellationFees(skip = 0, take = 10): Promise<any[]> {
    return this.executeQuery("listCancellationFees", () => Promise.resolve([])); // Placeholder
  }

  async getPenaltyDistribution(shipmentId: string): Promise<any> {
    return this.executeQuery("getPenaltyDistribution", () =>
      Promise.resolve({}),
    ); // Placeholder
  }
}
