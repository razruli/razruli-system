import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { FreightOwnerRepository } from "./repository";
import { FreightOwnerResponse } from "./types";

export class FreightOwnerService extends BaseService {
  private repository: FreightOwnerRepository;

  constructor(repository: FreightOwnerRepository, loaders: LoaderRegistry) {
    super("FreightOwnerService", loaders);
    this.repository = repository;
  }

  async getFreightOwner(id: string): Promise<FreightOwnerResponse | null> {
    return this.executeQuery("getFreightOwner", () =>
      this.repository.findById(id),
    );
  }

  async listFreightOwners(
    skip = 0,
    take = 10,
  ): Promise<FreightOwnerResponse[]> {
    return this.executeQuery("listFreightOwners", () =>
      this.repository.list(skip, take),
    );
  }

  async createFreightOwner(input: any): Promise<FreightOwnerResponse> {
    return this.executeMutation("createFreightOwner", input, () =>
      this.repository.create(input),
    );
  }

  async updateFreightOwner(
    id: string,
    input: any,
  ): Promise<FreightOwnerResponse> {
    return this.executeMutation("updateFreightOwner", input, () =>
      this.repository.update(id, input),
    );
  }
}
