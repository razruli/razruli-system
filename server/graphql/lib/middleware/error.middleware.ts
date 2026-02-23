import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
} from "@apollo/server";

import {
  AppError,
  ValidationError,
  AuthError,
} from "@/server/utils/errors/errors";
import { logger } from "@/server/utils/logger/logger";

export class ErrorBoundaryPlugin implements ApolloServerPlugin<BaseContext> {
  async requestDidStart() {
    return {
      async didEncounterErrors({ errors, operation }: any) {
        if (!errors || !errors.length) return;

        for (const error of errors) {
          const originalError = error.originalError;

          let code = "INTERNAL_ERROR";
          let message = "An unexpected error occurred";
          let statusCode = 500;

          if (originalError instanceof ValidationError) {
            code = "VALIDATION_ERROR";
            message = originalError.message;
            statusCode = 400;
          } else if (originalError instanceof AuthError) {
            code = "UNAUTHORIZED";
            message = originalError.message;
            statusCode = 401;
          } else if (originalError instanceof AppError) {
            code = originalError.code;
            message = originalError.message;
            statusCode = originalError.statusCode;
          }

          logger.error(
            `GraphQL Error in ${operation?.name?.value || "unknown"}`,
            originalError as Error,
          );

          error.extensions = {
            ...error.extensions,
            code,
            statusCode,
          };

          if (process.env.NODE_ENV === "production") {
            error.message = message;
            delete error.extensions.stacktrace;
          }
        }
      },
    } as GraphQLRequestListener<BaseContext>;
  }
}
