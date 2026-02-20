import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { ReviewsRepository } from "./repository";
import { ReviewsResponse } from "./types";
export class ReviewsService extends BaseService {
  private repository: ReviewsRepository;
  constructor(repository: ReviewsRepository, loaders: LoaderRegistry) {
    super("ReviewsService", loaders);
    this.repository = repository;
  }
  async getReviews(id: string, _useBatching = true): Promise<ReviewsResponse> {
    return this.executeQuery("getReviews", () => this.repository.findById(id));
  }
  async listReviews(skip = 0, take = 10): Promise<ReviewsResponse[]> {
    return this.executeQuery("listReviews", () =>
      this.repository.list(skip, take),
    );
  }
  async createReviews(input: any): Promise<ReviewsResponse> {
    return this.executeMutation("createReviews", input, () =>
      this.repository.create(input),
    );
  }
  async updateReviews(id: string, input: any): Promise<ReviewsResponse> {
    return this.executeMutation("updateReviews", input, () =>
      this.repository.update(id, input),
    );
  }

  // Resolver compatibility methods
  async getReview(id: string): Promise<ReviewsResponse> {
    return this.getReviews(id);
  }

  async listReviewsForCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<ReviewsResponse[]> {
    return this.executeQuery(
      "listReviewsForCarrier",
      () => this.repository.list(skip, take), // TODO: Filter by carrier
    );
  }

  async getCarrierAverageRating(carrierId: string): Promise<number> {
    return this.executeQuery("getCarrierAverageRating", () =>
      Promise.resolve(0),
    ); // Placeholder
  }
}
