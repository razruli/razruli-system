import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { BrokerRepository } from "./repository";
import {
  CreateBrokerInput,
  UpdateBrokerInput,
  BrokerFilters,
  BrokerResponse,
} from "./types";
import { NotFoundError, ValidationError } from "@/server/utils/errors/errors";

export class BrokerService extends BaseService {
  private repository: BrokerRepository;

  constructor(repository: BrokerRepository, loaders: LoaderRegistry) {
    super("BrokerService", loaders);
    this.repository = repository;
  }

  /**
   * Create new broker
   */
  // async createBroker(input: CreateBrokerInput): Promise<BrokerResponse> {
  //   return this.executeMutation("createBroker", input, async () => {
  //     // Validate inputs
  //     if (!input.name || input.name.trim().length === 0) {
  //       throw new ValidationError("Broker name is required");
  //     }
  //     if (!input.email || input.email.trim().length === 0) {
  //       throw new ValidationError("Broker email is required");
  //     }

  //     // Check for duplicate email
  //     const existing = await this.repository.findByEmail(input.email);
  //     if (existing) {
  //       throw new ValidationError(
  //         `Broker with email ${input.email} already exists`,
  //       );
  //     }

  //     // Check for duplicate license number if provided
  //     if (input.licenseNumber) {
  //       const existingLicense = await this.repository.findByLicenseNumber(
  //         input.licenseNumber,
  //       );
  //       if (existingLicense) {
  //         throw new ValidationError(
  //           `Broker with license number ${input.licenseNumber} already exists`,
  //         );
  //       }
  //     }

  //     return this.repository.create({
  //       ...input,
  //       status: "PENDING",
  //       createdAt: new Date(),
  //     } as any);
  //   });
  // }

  /**
   * Get broker by ID (with DataLoader batching when available)
   * Service decides: use DataLoader if this is a GraphQL request (batch multiple lookups)
   * Fall back to direct DB if this is a standalone service call
   */
  async getBroker(
    brokerId: string,
    useBatching = true,
  ): Promise<BrokerResponse> {
    return this.executeQuery("getBroker", async () => {
      // If batching requested (from resolver context), use DataLoader
      if (useBatching) {
        const loader = this.getLoader<BrokerResponse>("broker");
        const broker = await loader.load(brokerId);
        if (!broker) {
          throw new NotFoundError(`Broker not found: ${brokerId}`);
        }
        return broker;
      }

      // Otherwise direct DB call
      const broker = await this.repository.findById(brokerId);
      if (!broker) {
        throw new NotFoundError(`Broker not found: ${brokerId}`);
      }
      return broker as BrokerResponse;
    });
  }

  /**
   * Get brokers by status
   */
  async getBrokersByStatus(
    status: string,
    skip = 0,
    take = 50,
  ): Promise<{ data: BrokerResponse[]; total: number }> {
    return this.executeQuery("getBrokersByStatus", async () => {
      const brokers = await this.repository.findByStatus(status, skip, take);
      const total = await this.repository.countByStatus(status);
      return {
        data: brokers as BrokerResponse[],
        total,
      };
    });
  }

  /**
   * Search brokers by filters
   */
  async searchBrokers(
    filters: BrokerFilters,
    skip = 0,
    take = 50,
  ): Promise<{ data: BrokerResponse[]; total: number }> {
    return this.executeQuery("searchBrokers", async () => {
      const result = await this.repository.searchByFilters(filters, skip, take);
      return {
        data: result.data as BrokerResponse[],
        total: result.total,
      };
    });
  }

  /**
   * Update broker
   */
  // async updateBroker(
  //   brokerId: string,
  //   input: UpdateBrokerInput,
  // ): Promise<BrokerResponse> {
  //   return this.executeMutation("updateBroker", input, async () => {
  //     const broker = await this.repository.findById(brokerId);
  //     if (!broker) {
  //       throw new NotFoundError(`Broker not found: ${brokerId}`);
  //     }

  //     // Validate email uniqueness if updating email
  //     if (input.email && input.email !== broker.email) {
  //       const existing = await this.repository.findByEmail(input.email);
  //       if (existing) {
  //         throw new ValidationError(
  //           `Broker with email ${input.email} already exists`,
  //         );
  //       }
  //     }

  //     const updated = await this.repository.update(brokerId, {
  //       ...input,
  //       updatedAt: new Date(),
  //     } as any);

  //     return updated as BrokerResponse;
  //   });
  // }

  /**
   * Update broker status
   */
  async updateBrokerStatus(
    brokerId: string,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING",
  ): Promise<BrokerResponse> {
    return this.executeMutation("updateBrokerStatus", { status }, async () => {
      const broker = await this.repository.findById(brokerId);
      if (!broker) {
        throw new NotFoundError(`Broker not found: ${brokerId}`);
      }

      const updated = await this.repository.updateStatus(brokerId, status);
      return updated as BrokerResponse;
    });
  }

  /**
   * Delete broker
   */
  async deleteBroker(brokerId: string): Promise<void> {
    return this.executeMutation("deleteBroker", {}, async () => {
      const broker = await this.repository.findById(brokerId);
      if (!broker) {
        throw new NotFoundError(`Broker not found: ${brokerId}`);
      }

      await this.repository.delete(brokerId);
    });
  }

  /**
   * Count brokers by status
   */
  async countBrokersByStatus(status: string): Promise<number> {
    return this.executeQuery("countBrokersByStatus", async () => {
      return this.repository.countByStatus(status);
    });
  }

  /**
   * Get broker by license number
   */
  async getBrokerByLicenseNumber(
    licenseNumber: string,
  ): Promise<BrokerResponse> {
    return this.executeQuery("getBrokerByLicenseNumber", async () => {
      const broker = await this.repository.findByLicenseNumber(licenseNumber);
      if (!broker) {
        throw new NotFoundError(
          `Broker not found with license: ${licenseNumber}`,
        );
      }
      return broker as BrokerResponse;
    });
  }
}
