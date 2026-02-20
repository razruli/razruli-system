import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { AuditRepository } from "./repository";
import { AuditResponse } from "./types";

export class AuditService extends BaseService {
  private repository: AuditRepository;

  constructor(repository: AuditRepository, loaders: LoaderRegistry) {
    super("AuditService", loaders);
    this.repository = repository;
  }

  async getAudit(id: string, _useBatching = true): Promise<AuditResponse> {
    return this.executeQuery("getAudit", () => this.repository.findById(id));
  }

  async listAudits(skip = 0, take = 10): Promise<AuditResponse[]> {
    return this.executeQuery("listAudits", () =>
      this.repository.list(skip, take),
    );
  }

  async createAudit(input: any): Promise<AuditResponse> {
    return this.executeMutation("createAudit", input, () =>
      this.repository.create(input),
    );
  }

  async updateAudit(id: string, input: any): Promise<AuditResponse> {
    return this.executeMutation("updateAudit", input, () =>
      this.repository.update(id, input),
    );
  }

  async getShipmentEvents(shipmentId: string): Promise<AuditResponse[]> {
    return this.executeQuery("getShipmentEvents", () =>
      this.repository.findByShipmentId(shipmentId),
    );
  }
}
