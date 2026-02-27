import type { MiddlewareContext } from "./types";

/**
 * Error Handler Middleware
 * Formats errors consistently for GraphQL responses
 *
 * Maps error types to GraphQL error codes:
 * - UNAUTHENTICATED -> UNAUTHENTICATED
 * - UNAUTHORIZED -> FORBIDDEN
 * - VALIDATION_ERROR -> BAD_USER_INPUT
 * - Others -> INTERNAL_SERVER_ERROR
 */
export async function errorHandlerMiddleware<TResult>(
  resolverFn: () => Promise<TResult> | TResult,
  middlewareContext: MiddlewareContext,
): Promise<TResult> {
  try {
    return await resolverFn();
  } catch (error) {
    // Format error for GraphQL
    if (error instanceof Error) {
      return formatGraphQLError(error, middlewareContext);
    }

    // Handle non-Error objects
    console.error("[GraphQL Error] Non-Error object thrown:", error);
    throw {
      message: "Internal Server Error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    };
  }
}

/**
 * Format error message for GraphQL response
 */
function formatGraphQLError(
  error: Error,
  middlewareContext: MiddlewareContext,
): never {
  const message = error.message;

  // Authentication errors
  if (message.startsWith("UNAUTHENTICATED")) {
    console.warn("[Auth Error]", message);
    throw {
      message: message.replace("UNAUTHENTICATED: ", ""),
      extensions: { code: "UNAUTHENTICATED" },
    };
  }

  // Authorization errors
  if (message.startsWith("UNAUTHORIZED")) {
    console.warn("[Authorization Error]", message);
    throw {
      message: message.replace("UNAUTHORIZED: ", ""),
      extensions: { code: "FORBIDDEN" },
    };
  }

  // Permission format errors
  if (message.startsWith("PERMISSION_FORMAT_ERROR")) {
    console.error("[Permission Format Error]", message);
    throw {
      message: message.replace("PERMISSION_FORMAT_ERROR: ", ""),
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    };
  }

  // Validation errors
  if (message.startsWith("VALIDATION_ERROR")) {
    console.warn("[Validation Error]", message);
    throw {
      message: message.replace("VALIDATION_ERROR: ", ""),
      extensions: { code: "BAD_USER_INPUT" },
    };
  }

  // Database errors
  if (message.includes("Prisma") || message.includes("Database")) {
    console.error("[Database Error]", message);
    throw {
      message: "Database operation failed",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    };
  }

  // Parse errors
  if (message.startsWith("JSON.parse") || message.includes("SyntaxError")) {
    console.error("[Parse Error]", message);
    throw {
      message: "Invalid input format",
      extensions: { code: "BAD_USER_INPUT" },
    };
  }

  // Unexpected errors
  console.error("[Unexpected GraphQL Error]", error);
  throw {
    message: "Internal Server Error",
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
      // Only include details in development
      ...(process.env.NODE_ENV === "development" && {
        originalError: message,
      }),
    },
  };
}

/**
 * Create a custom GraphQL error
 */
export function createGraphQLError(
  message: string,
  code: string,
  details?: Record<string, any>,
): never {
  throw {
    message,
    extensions: { code, ...details },
  };
}
