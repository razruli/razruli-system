// server/services/user/userRepository.ts
import { Prisma, PrismaClient } from "@/server/db/generated/prisma/client";

import {
  UserResult,
  ListUsersInput,
  UsersListResult,
  CreateUserInput,
  UpdateUserInput,
} from "./types";

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<UserResult | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (_error) {
      throw new Error(`Failed to fetch user by ID: ${id}`);
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UserResult | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (_error) {
      throw new Error(`Failed to fetch user by email: ${email}`);
    }
  }

  /**
   * List all users with pagination
   */
  async listUsers(input: ListUsersInput): Promise<UsersListResult> {
    try {
      // Build where clause for filtering
      const where: Prisma.UserWhereInput = {
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" } },
            { email: { contains: input.search, mode: "insensitive" } },
          ],
        }),
        // Add emailVerified filter if provided
        ...(input.emailVerified !== undefined && {
          emailVerified: input.emailVerified,
        }),
        // Add createdAt range filters
        ...(input.createdAfter && {
          createdAt: { gte: input.createdAfter },
        }),
        ...(input.createdBefore && {
          createdAt: {
            ...(input.createdAfter && { gte: input.createdAfter }),
            lte: input.createdBefore,
          },
        }),
      };

      // Build order by
      let orderBy: any = { createdAt: "desc" };
      if (input.sortBy) {
        const validColumns = ["name", "email", "createdAt", "updatedAt"];
        if (validColumns.includes(input.sortBy)) {
          orderBy = {
            [input.sortBy]: input.sortOrder || "asc",
          };
        }
      }

      // Execute queries in parallel
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          take: input.limit,
          skip: input.offset,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy,
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        items: users,
        total,
        hasMore: input.offset + input.limit < total,
      };
    } catch (_error) {
      throw new Error("Failed to fetch users list");
    }
  }

  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<UserResult> {
    try {
      const user = await this.prisma.user.create({
        data: {
          id: input.id,
          name: input.name,
          email: input.email,
          image: input.image,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (_error) {
      throw new Error("Failed to create user");
    }
  }

  /**
   * Update user
   */
  async update(input: UpdateUserInput): Promise<UserResult> {
    try {
      const user = await this.prisma.user.update({
        where: { id: input.id },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (_error) {
      throw new Error(`Failed to update user: ${input.id}`);
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return true;
    } catch (_error) {
      throw new Error(`Failed to delete user: ${id}`);
    }
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    try {
      return await this.prisma.user.count();
    } catch (_error) {
      throw new Error("Failed to count users");
    }
  }
}
