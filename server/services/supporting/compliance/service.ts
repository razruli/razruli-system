import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { ComplianceRepository } from "./repository";
import { ComplianceResponse } from "./types";
export class ComplianceService extends BaseService {
  private repository: ComplianceRepository;
  constructor(repository: ComplianceRepository, loaders: LoaderRegistry) {
    super("ComplianceService", loaders);
    this.repository = repository;
  }
  async getCompliance(
    id: string,
    _useBatching = true,
  ): Promise<ComplianceResponse> {
    return this.executeQuery("getCompliance", () =>
      this.repository.findById(id),
    );
  }
  async listCompliance(skip = 0, take = 10): Promise<ComplianceResponse[]> {
    return this.executeQuery("listCompliance", () =>
      this.repository.list(skip, take),
    );
  }
  async createCompliance(input: any): Promise<ComplianceResponse> {
    return this.executeMutation("createCompliance", input, () =>
      this.repository.create(input),
    );
  }
  async updateCompliance(id: string, input: any): Promise<ComplianceResponse> {
    return this.executeMutation("updateCompliance", input, () =>
      this.repository.update(id, input),
    );
  }
}
