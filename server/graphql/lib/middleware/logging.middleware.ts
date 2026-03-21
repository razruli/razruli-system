import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
} from "@apollo/server";

import { logger } from "@/server/utils/logger/logger";

export class LoggingPlugin implements ApolloServerPlugin<BaseContext> {
  async requestDidStart(requestContext: any) {
    const startTime = Date.now();
    const { request, operationName } = requestContext;

    return {
      async willSendResponse({ errors }: any) {
        const duration = Date.now() - startTime;

        if (errors && errors.length > 0) {
          logger.error("GraphQL request failed", {
            operationName,
            duration,
            errorCount: errors.length,
            query: request.query?.substring(0, 100),
          });
        } else {
        }
      },
    } as GraphQLRequestListener<BaseContext>;
  }
}
