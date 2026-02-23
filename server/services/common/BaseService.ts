import DataLoader from "dataloader";

import { AppError, ValidationError } from "@/server/utils/errors/errors";
import { logger } from "@/server/utils/logger/logger";

/**
 * Registry of all DataLoader factories
 * Services call: this.getLoader('user') to batch-load users
 */
export interface LoaderRegistry {
  user: () => DataLoader<string, any>;
  [key: string]: () => DataLoader<string, any>;
}

export abstract class BaseService {
  protected modelName: string;
  protected loaders: LoaderRegistry;

  constructor(modelName: string, loaders: LoaderRegistry) {
    this.modelName = modelName;
    this.loaders = loaders;
  }

  /**
   * Get DataLoader for batch loading
   * Usage: const loader = this.getLoader('user'); loader.load(userId)
   */
  protected getLoader<T = any>(key: string): DataLoader<string, T> {
    const loader = this.loaders[key];
    if (!loader) {
      throw new Error(`Loader "${key}" not configured in LoaderRegistry`);
    }
    return loader() as DataLoader<string, T>;
  }

  protected async executeQuery<T>(
    operationName: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      const result = await operation();
      logger.info(`${this.modelName}.${operationName} succeeded`, {
        resultId: (result as any)?.id,
      });
      return result;
    } catch (error) {
      logger.error(`${this.modelName}.${operationName} failed`, error as Error);
      throw this.handleError(error);
    }
  }

  protected async executeMutation<T>(
    operationName: string,
    input: any,
    operation: () => Promise<T>,
    userId?: string,
  ): Promise<T> {
    try {
      const result = await operation();
      logger.info(`${this.modelName}.${operationName} succeeded`, {
        userId,
        resultId: (result as any)?.id,
      });
      return result;
    } catch (error) {
      logger.error(`${this.modelName}.${operationName} failed`, error as Error);
      throw this.handleError(error);
    }
  }

  protected validate(condition: boolean, message: string): asserts condition {
    if (!condition) {
      throw new ValidationError(message);
    }
  }

  protected handleError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      logger.error("Unexpected error", error);
      return new AppError(
        (error as any).code || "INTERNAL_ERROR",
        error.message,
      );
    }

    return new AppError("INTERNAL_ERROR", "An unexpected error occurred");
  }
}

export type { ListFilters, ListResult } from "./types";
