import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
} from "@apollo/server";

import { AuthError } from "@/server/utils/errors/errors";
import { logger } from "@/server/utils/logger/logger";

import { GraphQLContext } from "../../context";

const PROTECTED_OPERATIONS = new Set([
  // Mutations

  // Protected queries
  "me",
]);

export class AuthPlugin implements ApolloServerPlugin<BaseContext> {
  async requestDidStart() {
    return {
      async didResolveOperation({ operationName, contextValue }: any) {
        if (operationName && PROTECTED_OPERATIONS.has(operationName)) {
          const ctx = contextValue as GraphQLContext;

          if (!ctx.user) {
            logger.warn("Unauthorized access attempt", { operationName });
            throw new AuthError("Authentication required for this operation");
          }

          logger.info("Protected operation authorized", {
            operationName,
            userId: ctx.user.id,
          });
        }
      },
    } as GraphQLRequestListener<BaseContext>;
  }
}
