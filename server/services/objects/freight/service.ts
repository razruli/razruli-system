import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { FreightRepository } from "./repository";
import {
  CreateFreightInput,
  UpdateFreightInput,
  FreightResponse,
  FreightStatus,
} from "./types";
import { ValidationError } from "@/server/utils/errors/errors";

export class FreightService extends BaseService {
  private repository: FreightRepository;

  constructor(repository: FreightRepository, loaders: LoaderRegistry) {
    super("FreightService", loaders);
    this.repository = repository;
  }

  async getFreight(id: string): Promise<FreightResponse> {
    return this.executeQuery("getFreight", async () => {
      const freight = await this.repository.findById(id);
      if (!freight) {
        throw new ValidationError(`Freight not found: ${id}`);
      }
      return freight;
    });
  }

  async listFreights(skip = 0, take = 10): Promise<FreightResponse[]> {
    return this.executeQuery("listFreights", () =>
      this.repository.list(skip, take),
    );
  }

  async listAvailableFreights(skip = 0, take = 10): Promise<FreightResponse[]> {
    return this.executeQuery("listAvailableFreights", () =>
      this.repository.listAvailableFreights(),
    );
  }

  async getFreightByNumber(freightNumber: string): Promise<FreightResponse> {
    return this.executeQuery("getFreightByNumber", async () => {
      const freight = await this.repository.findByFreightNumber(freightNumber);
      if (!freight) {
        throw new ValidationError(`Freight not found: ${freightNumber}`);
      }
      return freight;
    });
  }

  async createFreight(input: CreateFreightInput): Promise<FreightResponse> {
    return this.executeMutation("createFreight", input, async () => {
      if (!input.freightOwnerId || !input.totalWeight) {
        throw new ValidationError(
          "freightOwnerId and totalWeight are required",
        );
      }
      return this.repository.create(input);
    });
  }

  async updateFreight(
    id: string,
    input: UpdateFreightInput,
  ): Promise<FreightResponse> {
    return this.executeMutation("updateFreight", input, async () => {
      return this.repository.update(id, input);
    });
  }

  async archiveFreight(id: string): Promise<FreightResponse> {
    return this.executeMutation("archiveFreight", { id }, async () => {
      return this.repository.update(id, { status: FreightStatus.archived });
    });
  }

  async claimFreight(id: string, brokerId: string): Promise<FreightResponse> {
    return this.executeMutation("claimFreight", { id, brokerId }, async () => {
      return this.repository.update(id, { status: FreightStatus.claimed });
    });
  }

  async releaseFreightClaim(id: string): Promise<FreightResponse> {
    return this.executeMutation("releaseFreightClaim", { id }, async () => {
      return this.repository.update(id, {
        status: FreightStatus.available,
      });
    });
  }

  async listFreightsByOwner(
    freightOwnerId: string,
    skip = 0,
    take = 10,
  ): Promise<FreightResponse[]> {
    return this.executeQuery("listFreightsByOwner", () =>
      this.repository.search({ freightOwnerId }, skip, take),
    );
  }
}
