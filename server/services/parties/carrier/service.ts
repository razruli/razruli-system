import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { CarrierRepository } from "./repository";
import {
  CreateCarrierInput,
  UpdateCarrierInput,
  CarrierFilters,
  CarrierResponse,
} from "./types";
import { NotFoundError, ValidationError } from "@/server/utils/errors/errors";

export class CarrierService extends BaseService {
  private repository: CarrierRepository;

  constructor(repository: CarrierRepository, loaders: LoaderRegistry) {
    super("CarrierService", loaders);
    this.repository = repository;
  }

  /**
   * Create new carrier
   */
  async createCarrier(input: CreateCarrierInput): Promise<CarrierResponse> {
    return this.executeMutation("createCarrier", input, async () => {
      // Validate inputs
      if (!input.name || input.name.trim().length === 0) {
        throw new ValidationError("Carrier name is required");
      }
      if (!input.email || input.email.trim().length === 0) {
        throw new ValidationError("Carrier email is required");
      }

      // Check for duplicate email
      const existing = await this.repository.findByEmail(input.email);
      if (existing) {
        throw new ValidationError(
          `Carrier with email ${input.email} already exists`,
        );
      }

      // Check for duplicate DOT number if provided
      if (input.dotNumber) {
        const existingDot = await this.repository.findByDotNumber(
          input.dotNumber,
        );
        if (existingDot) {
          throw new ValidationError(
            `Carrier with DOT number ${input.dotNumber} already exists`,
          );
        }
      }

      return this.repository.create({
        ...input,
        status: "PENDING",
        createdAt: new Date(),
      } as any);
    });
  }

  /**
   * Get carrier by ID
   */
  async getCarrier(carrierId: string): Promise<CarrierResponse> {
    return this.executeQuery("getCarrier", async () => {
      const carrier = await this.repository.findById(carrierId);
      if (!carrier) {
        throw new NotFoundError(`Carrier not found: ${carrierId}`);
      }
      return carrier as CarrierResponse;
    });
  }

  /**
   * Get carriers by status
   */
  async getCarriersByStatus(
    status: string,
    skip = 0,
    take = 50,
  ): Promise<{ data: CarrierResponse[]; total: number }> {
    return this.executeQuery("getCarriersByStatus", async () => {
      const carriers = await this.repository.findByStatus(status, skip, take);
      const total = await this.repository.countByStatus(status);
      return {
        data: carriers as CarrierResponse[],
        total,
      };
    });
  }

  /**
   * Search carriers by filters
   */
  async searchCarriers(
    filters: CarrierFilters,
    skip = 0,
    take = 50,
  ): Promise<{ data: CarrierResponse[]; total: number }> {
    return this.executeQuery("searchCarriers", async () => {
      const result = await this.repository.searchByFilters(filters, skip, take);
      return {
        data: result.data as CarrierResponse[],
        total: result.total,
      };
    });
  }

  /**
   * Update carrier
   */
  async updateCarrier(
    carrierId: string,
    input: UpdateCarrierInput,
  ): Promise<CarrierResponse> {
    return this.executeMutation("updateCarrier", input, async () => {
      const carrier = await this.repository.findById(carrierId);
      if (!carrier) {
        throw new NotFoundError(`Carrier not found: ${carrierId}`);
      }

      // Validate email uniqueness if updating email
      if (input.email && input.email !== carrier.email) {
        const existing = await this.repository.findByEmail(input.email);
        if (existing) {
          throw new ValidationError(
            `Carrier with email ${input.email} already exists`,
          );
        }
      }

      const updated = await this.repository.update(carrierId, {
        ...input,
        updatedAt: new Date(),
      } as any);

      return updated as CarrierResponse;
    });
  }

  /**
   * Update carrier status
   */
  async updateCarrierStatus(
    carrierId: string,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING",
  ): Promise<CarrierResponse> {
    return this.executeMutation("updateCarrierStatus", { status }, async () => {
      const carrier = await this.repository.findById(carrierId);
      if (!carrier) {
        throw new NotFoundError(`Carrier not found: ${carrierId}`);
      }

      const updated = await this.repository.updateStatus(carrierId, status);
      return updated as CarrierResponse;
    });
  }

  /**
   * Delete carrier (soft or hard)
   */
  async deleteCarrier(carrierId: string): Promise<void> {
    return this.executeMutation("deleteCarrier", {}, async () => {
      const carrier = await this.repository.findById(carrierId);
      if (!carrier) {
        throw new NotFoundError(`Carrier not found: ${carrierId}`);
      }

      await this.repository.delete(carrierId);
    });
  }

  /**
   * Count carriers by status
   */
  async countCarriersByStatus(status: string): Promise<number> {
    return this.executeQuery("countCarriersByStatus", async () => {
      return this.repository.countByStatus(status);
    });
  }

  /**
   * Get carrier by DOT number
   */
  async getCarrierByDotNumber(dotNumber: string): Promise<CarrierResponse> {
    return this.executeQuery("getCarrierByDotNumber", async () => {
      const carrier = await this.repository.findByDotNumber(dotNumber);
      if (!carrier) {
        throw new NotFoundError(`Carrier not found with DOT: ${dotNumber}`);
      }
      return carrier as CarrierResponse;
    });
  }

  /**
   * Get carrier by MC number
   */
  async getCarrierByMcNumber(mcNumber: string): Promise<CarrierResponse> {
    return this.executeQuery("getCarrierByMcNumber", async () => {
      const carrier = await this.repository.findByMcNumber(mcNumber);
      if (!carrier) {
        throw new NotFoundError(`Carrier not found with MC: ${mcNumber}`);
      }
      return carrier as CarrierResponse;
    });
  }

  /**
   * List carriers by rating threshold
   */
  async listCarriersByRating(
    minRating: number,
    skip = 0,
    take = 50,
  ): Promise<CarrierResponse[]> {
    return this.executeQuery("listCarriersByRating", async () => {
      return (await this.repository.findByMinRating(
        minRating,
        skip,
        take,
      )) as CarrierResponse[];
    });
  }

  /**
   * Update carrier rating
   */
  async updateCarrierRating(
    carrierId: string,
    rating: number,
  ): Promise<CarrierResponse> {
    return this.executeMutation("updateCarrierRating", { rating }, async () => {
      if (rating < 0 || rating > 5) {
        throw new ValidationError("Rating must be between 0 and 5");
      }

      const carrier = await this.repository.findById(carrierId);
      if (!carrier) {
        throw new NotFoundError(`Carrier not found: ${carrierId}`);
      }

      const updated = await this.repository.update(carrierId, {
        rating,
        updatedAt: new Date(),
      } as any);

      return updated as CarrierResponse;
    });
  }

  /**
   * Submit bid on shipment
   */
  async submitBid(
    shipmentId: string,
    input: any,
  ): Promise<{ success: boolean; bidId: string }> {
    return this.executeMutation("submitBid", input, async () => {
      // TODO: Integrate with BiddingService when available
      // For now, return success with placeholder
      return {
        success: true,
        bidId: `bid_${Date.now()}`,
      };
    });
  }
}
