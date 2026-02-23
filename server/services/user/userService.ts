// server/services/user/userService.ts
import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { logger } from "@/server/utils/logger/logger";

import { UserResult, ListUsersInput, UsersListResult } from "./types";
import { UserRepository } from "./userRepository";

export class UserService extends BaseService {
  private repository: UserRepository;

  constructor(repository: UserRepository, loaders: LoaderRegistry) {
    super("UserService", loaders);
    this.repository = repository;
  }

  async getCurrentUser(userId: string): Promise<UserResult | null> {
    try {
      logger.info("Fetching current user", { userId });
      const user = await this.repository.findById(userId);

      if (!user) {
        logger.warn("User not found in database", { userId });
        return null;
      }

      logger.info("User fetched successfully", { userId: user.id });
      return user;
    } catch (error) {
      logger.error("Failed to fetch current user", error);
      throw error;
    }
  }

  async listUsers(input: ListUsersInput): Promise<UsersListResult> {
    try {
      logger.info("Listing users", {
        limit: input.limit,
        offset: input.offset,
        sortBy: input.sortBy,
        sortOrder: input.sortOrder,
        search: input.search,
        status: input.status,
        emailVerified: input.emailVerified,
        createdBefore: input.createdBefore,
        createdAfter: input.createdAfter,
      });

      // Validate input
      if (input.limit < 1 || input.offset < 0) {
        throw new Error("Invalid pagination parameters");
      }

      const result = await this.repository.listUsers(input);

      logger.info("Users listed successfully", {
        count: result.items.length,
        total: result.total,
      });

      return result;
    } catch (error) {
      logger.error("Failed to list users", error);
      throw error;
    }
  }

  // ... other methods
}
