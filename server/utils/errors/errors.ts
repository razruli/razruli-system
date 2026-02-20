// server/utils/errors.ts
import { GraphQLError } from "graphql";

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "INTERNAL_SERVER_ERROR",
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "BAD_REQUEST", 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export function handleError(error: unknown): GraphQLError {
  if (error instanceof AppError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: error.code,
        statusCode: error.statusCode,
      },
    });
  }

  if (error instanceof Error) {
    return new GraphQLError(error.message, {
      originalError: error,
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      },
    });
  }

  return new GraphQLError("An unexpected error occurred", {
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    },
  });
}
