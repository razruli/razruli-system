import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { BiddingRepository } from "./repository";
import { BiddingResponse } from "./types";

export class BiddingService extends BaseService {
  private repository: BiddingRepository;

  constructor(repository: BiddingRepository, loaders: LoaderRegistry) {
    super("BiddingService", loaders);
    this.repository = repository;
  }

  async getBidding(id: string, _useBatching = true): Promise<BiddingResponse> {
    return this.executeQuery("getBidding", () => this.repository.findById(id));
  }

  async listBiddings(skip = 0, take = 10): Promise<BiddingResponse[]> {
    return this.executeQuery("listBiddings", () =>
      this.repository.list(skip, take),
    );
  }

  async createBidding(input: any): Promise<BiddingResponse> {
    return this.executeMutation("createBidding", input, () =>
      this.repository.create(input),
    );
  }

  async updateBidding(id: string, input: any): Promise<BiddingResponse> {
    return this.executeMutation("updateBidding", input, () =>
      this.repository.update(id, input),
    );
  }

  async listBidsForShipment(
    shipmentId: string,
    skip = 0,
    take = 50,
  ): Promise<BiddingResponse[]> {
    return this.executeQuery("listBidsForShipment", () =>
      this.repository.listByShipment(shipmentId, skip, take),
    );
  }

  // Alias methods for resolver compatibility
  async getBid(id: string): Promise<BiddingResponse> {
    return this.getBidding(id);
  }

  async listBids(skip = 0, take = 10): Promise<BiddingResponse[]> {
    return this.listBiddings(skip, take);
  }

  async createBid(input: any): Promise<BiddingResponse> {
    return this.createBidding(input);
  }

  async updateBid(id: string, input: any): Promise<BiddingResponse> {
    return this.updateBidding(id, input);
  }

  async listBidsForCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<BiddingResponse[]> {
    return this.executeQuery(
      "listBidsForCarrier",
      () => this.repository.list(skip, take), // TODO: Filter by carrier
    );
  }

  async getBidRules(shipmentId: string): Promise<any[]> {
    return this.executeQuery("getBidRules", () => Promise.resolve([])); // Placeholder
  }

  async rejectBid(bidId: string): Promise<BiddingResponse> {
    return this.executeQuery("rejectBid", () =>
      this.repository.update(bidId, { status: "rejected" }),
    );
  }

  async createBidRule(input: any): Promise<any> {
    return this.executeMutation("createBidRule", input, () =>
      Promise.resolve(input),
    ); // Placeholder
  }

  async updateBidRule(id: string, input: any): Promise<any> {
    return this.executeMutation("updateBidRule", input, () =>
      Promise.resolve(input),
    ); // Placeholder
  }

  async deleteBidRule(id: string): Promise<void> {
    return this.executeMutation("deleteBidRule", { id }, () =>
      Promise.resolve(),
    ); // Placeholder
  }

  async overrideBidRuleCompliance(
    bidId: string,
    reason: string,
  ): Promise<BiddingResponse> {
    return this.executeQuery("overrideBidRuleCompliance", () =>
      this.repository.update(bidId, { status: "overridden" }),
    );
  }

  async subscribeToNewBid(shipmentId: string): Promise<any> {
    return this.executeQuery("subscribeToNewBid", () => Promise.resolve({})); // Placeholder
  }
}
