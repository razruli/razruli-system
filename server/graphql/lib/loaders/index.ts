import DataLoader from "dataloader";

import { PrismaClient } from "@/server/db/generated/prisma/client";
import { LoaderRegistry } from "@/server/services/common/BaseService";

/**
 * Create fresh DataLoader factories for each request
 * Each factory is called when needed: loaders.user()
 * This ensures no cache pollution across requests
 */
export function createLoaders(prisma: PrismaClient): LoaderRegistry {
  return {
    /**
     * Batch load users by ID
     */
    user: () =>
      new DataLoader<string, any>(async (userIds) => {
        return Promise.all(
          userIds.map((id) =>
            prisma.user
              .findUnique({ where: { id } })
              .then((user: any) => user || new Error(`User not found: ${id}`)),
          ),
        );
      }),
  };
}

export type { LoaderRegistry } from "@/server/services/common/BaseService";
