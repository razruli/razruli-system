import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { WarehouseRepository } from "./repository";
import {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  WarehouseFilters,
  WarehouseResponse,
} from "./types";
import { NotFoundError, ValidationError } from "@/server/utils/errors/errors";

export class WarehouseService extends BaseService {
  private repository: WarehouseRepository;

  constructor(repository: WarehouseRepository, loaders: LoaderRegistry) {
    super("WarehouseService", loaders);
    this.repository = repository;
  }

  /**
   * Create new warehouse
   */
  async createWarehouse(
    input: CreateWarehouseInput,
  ): Promise<WarehouseResponse> {
    return this.executeMutation("createWarehouse", input, async () => {
      // Validate inputs
      if (!input.name || input.name.trim().length === 0) {
        throw new ValidationError("Warehouse name is required");
      }
      if (!input.email || input.email.trim().length === 0) {
        throw new ValidationError("Warehouse email is required");
      }
      if (!input.addressLine1 || input.addressLine1.trim().length === 0) {
        throw new ValidationError("Warehouse address is required");
      }
      if (!input.city || input.city.trim().length === 0) {
        throw new ValidationError("Warehouse city is required");
      }
      if (!input.state || input.state.trim().length === 0) {
        throw new ValidationError("Warehouse state is required");
      }

      // Check for duplicate email
      const existing = await this.repository.findByEmail(input.email);
      if (existing) {
        throw new ValidationError(
          `Warehouse with email ${input.email} already exists`,
        );
      }

      return this.repository.create({
        ...input,
        status: "PENDING",
        createdAt: new Date(),
      } as any);
    });
  }

  /**
   * Get warehouse by ID
   */
  async getWarehouse(warehouseId: string): Promise<WarehouseResponse> {
    return this.executeQuery("getWarehouse", async () => {
      const warehouse = await this.repository.findById(warehouseId);
      if (!warehouse) {
        throw new NotFoundError(`Warehouse not found: ${warehouseId}`);
      }
      return warehouse as WarehouseResponse;
    });
  }

  /**
   * Get warehouses by status
   */
  async getWarehousesByStatus(
    status: string,
    skip = 0,
    take = 50,
  ): Promise<{ data: WarehouseResponse[]; total: number }> {
    return this.executeQuery("getWarehousesByStatus", async () => {
      const warehouses = await this.repository.findByStatus(status, skip, take);
      const total = await this.repository.countByStatus(status);
      return {
        data: warehouses as WarehouseResponse[],
        total,
      };
    });
  }

  /**
   * Get warehouses by city
   */
  async getWarehousesByCity(
    city: string,
    skip = 0,
    take = 50,
  ): Promise<{ data: WarehouseResponse[]; total: number }> {
    return this.executeQuery("getWarehousesByCity", async () => {
      const warehouses = await this.repository.findByCity(city, skip, take);
      return {
        data: warehouses as WarehouseResponse[],
        total: warehouses.length,
      };
    });
  }

  /**
   * Search warehouses by filters
   */
  async searchWarehouses(
    filters: WarehouseFilters,
    skip = 0,
    take = 50,
  ): Promise<{ data: WarehouseResponse[]; total: number }> {
    return this.executeQuery("searchWarehouses", async () => {
      const result = await this.repository.searchByFilters(filters, skip, take);
      return {
        data: result.data as WarehouseResponse[],
        total: result.total,
      };
    });
  }

  /**
   * Update warehouse
   */
  async updateWarehouse(
    warehouseId: string,
    input: UpdateWarehouseInput,
  ): Promise<WarehouseResponse> {
    return this.executeMutation("updateWarehouse", input, async () => {
      const warehouse = await this.repository.findById(warehouseId);
      if (!warehouse) {
        throw new NotFoundError(`Warehouse not found: ${warehouseId}`);
      }

      // Validate email uniqueness if updating email
      if (input.email && input.email !== warehouse.managerEmail) {
        const existing = await this.repository.findByEmail(input.email);
        if (existing) {
          throw new ValidationError(
            `Warehouse with email ${input.email} already exists`,
          );
        }
      }

      const updated = await this.repository.update(warehouseId, {
        ...input,
        updatedAt: new Date(),
      } as any);

      return updated as WarehouseResponse;
    });
  }

  /**
   * Update warehouse status
   */
  async updateWarehouseStatus(
    warehouseId: string,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING",
  ): Promise<WarehouseResponse> {
    return this.executeMutation(
      "updateWarehouseStatus",
      { status },
      async () => {
        const warehouse = await this.repository.findById(warehouseId);
        if (!warehouse) {
          throw new NotFoundError(`Warehouse not found: ${warehouseId}`);
        }

        const updated = await this.repository.updateStatus(warehouseId, status);
        return updated as WarehouseResponse;
      },
    );
  }

  /**
   * Delete warehouse
   */
  async deleteWarehouse(warehouseId: string): Promise<void> {
    return this.executeMutation("deleteWarehouse", {}, async () => {
      const warehouse = await this.repository.findById(warehouseId);
      if (!warehouse) {
        throw new NotFoundError(`Warehouse not found: ${warehouseId}`);
      }

      await this.repository.delete(warehouseId);
    });
  }

  /**
   * Count warehouses by status
   */
  async countWarehousesByStatus(status: string): Promise<number> {
    return this.executeQuery("countWarehousesByStatus", async () => {
      return this.repository.countByStatus(status);
    });
  }

  /**
   * Find warehouses by capacity range
   */
  async findWarehousesByCapacityRange(
    minCapacity: number,
    maxCapacity: number,
    skip = 0,
    take = 50,
  ): Promise<{ data: WarehouseResponse[]; total: number }> {
    return this.executeQuery("findWarehousesByCapacityRange", async () => {
      const warehouses = await this.repository.findByCapacityRange(
        minCapacity,
        maxCapacity,
        skip,
        take,
      );
      return {
        data: warehouses as WarehouseResponse[],
        total: warehouses.length,
      };
    });
  }
}
