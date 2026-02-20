import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { ShipmentRepository } from "./repository";
import {
  CreateShipmentInput,
  UpdateShipmentInput,
  ShipmentResponse,
} from "./types";
import { ValidationError } from "@/server/utils/errors/errors";

export class ShipmentService extends BaseService {
  private repository: ShipmentRepository;

  constructor(repository: ShipmentRepository, loaders: LoaderRegistry) {
    super("ShipmentService", loaders);
    this.repository = repository;
  }

  async getShipment(id: string): Promise<ShipmentResponse> {
    return this.executeQuery("getShipment", async () => {
      const shipment = await this.repository.findById(id);
      if (!shipment) {
        throw new ValidationError(`Shipment not found: ${id}`);
      }
      return shipment;
    });
  }

  async listShipments(skip = 0, take = 10): Promise<ShipmentResponse[]> {
    return this.executeQuery("listShipments", () =>
      this.repository.list(skip, take),
    );
  }

  async getShipmentByNumber(shipmentNumber: string): Promise<ShipmentResponse> {
    return this.executeQuery("getShipmentByNumber", async () => {
      const shipment =
        await this.repository.findByShipmentNumber(shipmentNumber);
      if (!shipment) {
        throw new ValidationError(`Shipment not found: ${shipmentNumber}`);
      }
      return shipment;
    });
  }

  async listShipmentsByBroker(
    brokerId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentResponse[]> {
    return this.executeQuery("listShipmentsByBroker", () =>
      this.repository.search({ brokerId }, skip, take),
    );
  }

  async listShipmentsByCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentResponse[]> {
    return this.executeQuery("listShipmentsByCarrier", () =>
      this.repository.search({ carrierId }, skip, take),
    );
  }

  async createShipment(input: CreateShipmentInput): Promise<ShipmentResponse> {
    return this.executeMutation("createShipment", input, async () => {
      if (!input.freightOwnerId || !input.brokerId) {
        throw new ValidationError("freightOwnerId and brokerId are required");
      }
      return this.repository.create(input);
    });
  }

  async updateShipment(
    id: string,
    input: UpdateShipmentInput,
  ): Promise<ShipmentResponse> {
    return this.executeMutation("updateShipment", input, async () => {
      return this.repository.update(id, input);
    });
  }

  async openBidding(
    shipmentId: string,
    brokerMarginPercent: number,
  ): Promise<ShipmentResponse> {
    return this.executeMutation(
      "openBidding",
      { shipmentId, brokerMarginPercent },
      async () => {
        return this.repository.update(shipmentId, {
          brokerMarginPercent,
        } as any);
      },
    );
  }

  async acceptBid(
    shipmentId: string,
    bidId: string,
  ): Promise<ShipmentResponse> {
    return this.executeMutation(
      "acceptBid",
      { shipmentId, bidId },
      async () => {
        return this.repository.update(shipmentId, {
          acceptedBidId: bidId,
        } as any);
      },
    );
  }

  async cancelShipment(shipmentId: string): Promise<ShipmentResponse> {
    return this.executeMutation("cancelShipment", { shipmentId }, async () => {
      return this.repository.update(shipmentId, {} as any);
    });
  }

  async listShipmentsByOwner(
    freightOwnerId: string,
    skip = 0,
    take = 10,
  ): Promise<ShipmentResponse[]> {
    return this.executeQuery("listShipmentsByOwner", () =>
      this.repository.listByFreightOwner(freightOwnerId, skip, take),
    );
  }

  async subscribeToShipmentStatus(_shipmentId: string): Promise<any> {
    return null; // Placeholder for subscription logic
  }

  async subscribeToBidReceived(_shipmentId: string): Promise<any> {
    return null; // Placeholder for subscription logic
  }

  async subscribeToBidAccepted(_shipmentId: string): Promise<any> {
    return null; // Placeholder for subscription logic
  }
}
