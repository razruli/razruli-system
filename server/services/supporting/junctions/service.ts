import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import {
  ShipmentFreightRepository,
  ShipmentStopRepository,
  ShipmentLogRepository,
  ShipmentEventRepository,
  ShipmentDocumentRepository,
} from "./repository";
import {
  ShipmentFreightResponse,
  CreateShipmentFreightInput,
  UpdateShipmentFreightInput,
  ShipmentFreightFilters,
  ShipmentStopResponse,
  CreateShipmentStopInput,
  UpdateShipmentStopInput,
  ShipmentStopFilters,
  ShipmentLogResponse,
  CreateShipmentLogInput,
  UpdateShipmentLogInput,
  ShipmentLogFilters,
  ShipmentEventResponse,
  CreateShipmentEventInput,
  UpdateShipmentEventInput,
  ShipmentEventFilters,
  ShipmentDocumentResponse,
  CreateShipmentDocumentInput,
  UpdateShipmentDocumentInput,
  ShipmentDocumentFilters,
} from "./types";

export class JunctionsService extends BaseService {
  private shipmentFreightRepository: ShipmentFreightRepository;
  private shipmentStopRepository: ShipmentStopRepository;
  private shipmentLogRepository: ShipmentLogRepository;
  private shipmentEventRepository: ShipmentEventRepository;
  private shipmentDocumentRepository: ShipmentDocumentRepository;

  constructor(
    freightRepo: ShipmentFreightRepository,
    stopRepo: ShipmentStopRepository,
    logRepo: ShipmentLogRepository,
    eventRepo: ShipmentEventRepository,
    documentRepo: ShipmentDocumentRepository,
    loaders: LoaderRegistry,
  ) {
    super("JunctionsService", loaders);
    this.shipmentFreightRepository = freightRepo;
    this.shipmentStopRepository = stopRepo;
    this.shipmentLogRepository = logRepo;
    this.shipmentEventRepository = eventRepo;
    this.shipmentDocumentRepository = documentRepo;
  }

  // ========================================================================
  // SHIPMENT FREIGHT JUNCTION
  // ========================================================================

  async getShipmentFreight(id: string): Promise<ShipmentFreightResponse> {
    return this.executeQuery("getShipmentFreight", async () => {
      const freight = await this.shipmentFreightRepository.findById(id);
      if (!freight) throw new Error(`ShipmentFreight not found: ${id}`);
      return freight;
    });
  }

  async getShipmentFreightByShipmentAndFreight(
    shipmentId: string,
    freightId: string,
  ): Promise<ShipmentFreightResponse | null> {
    return this.executeQuery(
      "getShipmentFreightByShipmentAndFreight",
      async () => {
        return this.shipmentFreightRepository.findByShipmentAndFreight(
          shipmentId,
          freightId,
        );
      },
    );
  }

  async searchShipmentFreights(
    filters: ShipmentFreightFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentFreightResponse[]> {
    return this.executeQuery("searchShipmentFreights", async () => {
      return this.shipmentFreightRepository.search(filters, skip, take);
    });
  }

  async listShipmentFreightsByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentFreightResponse[]> {
    return this.executeQuery("listShipmentFreightsByShipment", async () => {
      return this.shipmentFreightRepository.listByShipment(
        shipmentId,
        skip,
        take,
      );
    });
  }

  async createShipmentFreight(
    input: CreateShipmentFreightInput,
  ): Promise<ShipmentFreightResponse> {
    return this.executeMutation("createShipmentFreight", input, async () => {
      return this.shipmentFreightRepository.create(input);
    });
  }

  async updateShipmentFreight(
    id: string,
    input: UpdateShipmentFreightInput,
  ): Promise<ShipmentFreightResponse> {
    return this.executeMutation("updateShipmentFreight", input, async () => {
      return this.shipmentFreightRepository.update(id, input);
    });
  }

  async deleteShipmentFreight(id: string): Promise<void> {
    return this.executeMutation("deleteShipmentFreight", { id }, async () => {
      await this.shipmentFreightRepository.delete(id);
    });
  }

  // ========================================================================
  // SHIPMENT STOP
  // ========================================================================

  async getShipmentStop(id: string): Promise<ShipmentStopResponse> {
    return this.executeQuery("getShipmentStop", async () => {
      const stop = await this.shipmentStopRepository.findById(id);
      if (!stop) throw new Error(`ShipmentStop not found: ${id}`);
      return stop;
    });
  }

  async searchShipmentStops(
    filters: ShipmentStopFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentStopResponse[]> {
    return this.executeQuery("searchShipmentStops", async () => {
      return this.shipmentStopRepository.search(filters, skip, take);
    });
  }

  async listShipmentStopsByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentStopResponse[]> {
    return this.executeQuery("listShipmentStopsByShipment", async () => {
      return this.shipmentStopRepository.listByShipment(shipmentId, skip, take);
    });
  }

  async createShipmentStop(
    input: CreateShipmentStopInput,
  ): Promise<ShipmentStopResponse> {
    return this.executeMutation("createShipmentStop", input, async () => {
      return this.shipmentStopRepository.create(input);
    });
  }

  async updateShipmentStop(
    id: string,
    input: UpdateShipmentStopInput,
  ): Promise<ShipmentStopResponse> {
    return this.executeMutation("updateShipmentStop", input, async () => {
      return this.shipmentStopRepository.update(id, input);
    });
  }

  async deleteShipmentStop(id: string): Promise<void> {
    return this.executeMutation("deleteShipmentStop", { id }, async () => {
      await this.shipmentStopRepository.delete(id);
    });
  }

  // ========================================================================
  // SHIPMENT LOG
  // ========================================================================

  async getShipmentLog(id: string): Promise<ShipmentLogResponse> {
    return this.executeQuery("getShipmentLog", async () => {
      const log = await this.shipmentLogRepository.findById(id);
      if (!log) throw new Error(`ShipmentLog not found: ${id}`);
      return log;
    });
  }

  async searchShipmentLogs(
    filters: ShipmentLogFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentLogResponse[]> {
    return this.executeQuery("searchShipmentLogs", async () => {
      return this.shipmentLogRepository.search(filters, skip, take);
    });
  }

  async listShipmentLogsByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentLogResponse[]> {
    return this.executeQuery("listShipmentLogsByShipment", async () => {
      return this.shipmentLogRepository.listByShipment(shipmentId, skip, take);
    });
  }

  async createShipmentLog(
    input: CreateShipmentLogInput,
  ): Promise<ShipmentLogResponse> {
    return this.executeMutation("createShipmentLog", input, async () => {
      return this.shipmentLogRepository.create(input);
    });
  }

  async updateShipmentLog(
    id: string,
    input: UpdateShipmentLogInput,
  ): Promise<ShipmentLogResponse> {
    return this.executeMutation("updateShipmentLog", input, async () => {
      return this.shipmentLogRepository.update(id, input);
    });
  }

  async deleteShipmentLog(id: string): Promise<void> {
    return this.executeMutation("deleteShipmentLog", { id }, async () => {
      await this.shipmentLogRepository.delete(id);
    });
  }

  // ========================================================================
  // SHIPMENT EVENT
  // ========================================================================

  async getShipmentEvent(id: string): Promise<ShipmentEventResponse> {
    return this.executeQuery("getShipmentEvent", async () => {
      const event = await this.shipmentEventRepository.findById(id);
      if (!event) throw new Error(`ShipmentEvent not found: ${id}`);
      return event;
    });
  }

  async searchShipmentEvents(
    filters: ShipmentEventFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentEventResponse[]> {
    return this.executeQuery("searchShipmentEvents", async () => {
      return this.shipmentEventRepository.search(filters, skip, take);
    });
  }

  async listShipmentEventsByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentEventResponse[]> {
    return this.executeQuery("listShipmentEventsByShipment", async () => {
      return this.shipmentEventRepository.listByShipment(
        shipmentId,
        skip,
        take,
      );
    });
  }

  async createShipmentEvent(
    input: CreateShipmentEventInput,
  ): Promise<ShipmentEventResponse> {
    return this.executeMutation("createShipmentEvent", input, async () => {
      return this.shipmentEventRepository.create(input);
    });
  }

  async updateShipmentEvent(
    id: string,
    input: UpdateShipmentEventInput,
  ): Promise<ShipmentEventResponse> {
    return this.executeMutation("updateShipmentEvent", input, async () => {
      return this.shipmentEventRepository.update(id, input);
    });
  }

  async deleteShipmentEvent(id: string): Promise<void> {
    return this.executeMutation("deleteShipmentEvent", { id }, async () => {
      await this.shipmentEventRepository.delete(id);
    });
  }

  // ========================================================================
  // SHIPMENT DOCUMENT
  // ========================================================================

  async getShipmentDocument(id: string): Promise<ShipmentDocumentResponse> {
    return this.executeQuery("getShipmentDocument", async () => {
      const document = await this.shipmentDocumentRepository.findById(id);
      if (!document) throw new Error(`ShipmentDocument not found: ${id}`);
      return document;
    });
  }

  async searchShipmentDocuments(
    filters: ShipmentDocumentFilters,
    skip = 0,
    take = 10,
  ): Promise<ShipmentDocumentResponse[]> {
    return this.executeQuery("searchShipmentDocuments", async () => {
      return this.shipmentDocumentRepository.search(filters, skip, take);
    });
  }

  async listShipmentDocumentsByShipment(
    shipmentId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentDocumentResponse[]> {
    return this.executeQuery("listShipmentDocumentsByShipment", async () => {
      return this.shipmentDocumentRepository.listByShipment(
        shipmentId,
        skip,
        take,
      );
    });
  }

  async createShipmentDocument(
    input: CreateShipmentDocumentInput,
  ): Promise<ShipmentDocumentResponse> {
    return this.executeMutation("createShipmentDocument", input, async () => {
      return this.shipmentDocumentRepository.create(input);
    });
  }

  async updateShipmentDocument(
    id: string,
    input: UpdateShipmentDocumentInput,
  ): Promise<ShipmentDocumentResponse> {
    return this.executeMutation("updateShipmentDocument", input, async () => {
      return this.shipmentDocumentRepository.update(id, input);
    });
  }

  async deleteShipmentDocument(id: string): Promise<void> {
    return this.executeMutation("deleteShipmentDocument", { id }, async () => {
      await this.shipmentDocumentRepository.delete(id);
    });
  }
}
