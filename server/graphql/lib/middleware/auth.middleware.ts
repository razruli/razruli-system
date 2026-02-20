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
  "createCarrier",
  "updateCarrier",
  "deleteCarrier",
  "createBroker",
  "updateBroker",
  "createShipment",
  "updateShipment",
  "acceptBid",
  "submitBid",
  "cancelShipment",
  // Protected queries
  "me",
  "myCarrier",
  "myBroker",
]);

export class AuthPlugin implements ApolloServerPlugin<BaseContext> {
  async requestDidStart(requestContext: any) {
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
