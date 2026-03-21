// server/graphql/server.ts
import { readFileSync } from "fs";
import path from "path";

import {
  ApolloServer,
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { logger } from "../utils/logger/logger";

import { GraphQLContext } from "./context";
import { createContext } from "./context/context";
import {
  ErrorBoundaryPlugin,
  AuthPlugin,
  LoggingPlugin,
  ComplexityPlugin,
} from "./lib/middleware";
import { resolvers } from "./resolvers/resolvers";

/**
 * Load GraphQL schema files including fragments
 * Dynamically loads all .graphql files from schema directory structure
 */
function loadSchema(): string[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs");
  const schemaPath = path.join(process.cwd(), "server/graphql/schema");

  function loadFilesRecursively(dir: string): string[] {
    const files: string[] = [];

    // Load files from directory in order: scalars, index first, then subdirectories
    const entries = fs.readdirSync(dir);

    // Priority order: scalars, index, then all else
    const ordered = entries.sort((a: string, _b: string) => {
      if (a === "scalars.graphql") return -2;
      if (a === "index.graphql") return -1;
      if (a === "fragments") return 0;
      if (a === "auth") return 1;
      if (a === "parties") return 2;
      if (a === "objects") return 3;
      if (a === "supporting") return 4;
      if (a === "subscriptions.graphql") return 5;
      return 10;
    });

    for (const entry of ordered) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isFile() && entry.endsWith(".graphql")) {
        try {
          const content = readFileSync(fullPath, "utf8");
          logger.debug(`Loaded schema file: ${entry}`);
          files.push(content);
        } catch (error) {
          logger.error(`Failed to load schema file: ${entry}`, error);
          throw new Error(`Failed to load GraphQL schema: ${entry}`);
        }
      } else if (stat.isDirectory() && !entry.startsWith(".")) {
        // Recursively load subdirectories
        files.push(...loadFilesRecursively(fullPath));
      }
    }

    return files;
  }

  const schemas = loadFilesRecursively(schemaPath);
  logger.info(`Loaded ${schemas.length} GraphQL schema files`);
  return schemas;
}

/**
 * Apollo Server Plugin for monitoring and error handling
 * Uses Apollo Server v5 plugin API with correct lifecycle methods
 */
const serverPlugin: ApolloServerPlugin<GraphQLContext> = {
  async serverWillStart() {
    logger.info("Apollo Server starting...");
    return {
      async schemaDidLoadOrUpdate() {
        logger.info("GraphQL schema loaded with fragments");
      },
      async drainServer() {
        logger.info("Apollo Server draining...");
      },
      async serverWillStop() {
        logger.info("Apollo Server stopping...");
      },
    };
  },

  async requestDidStart({ request }) {
    const startTime = Date.now();
    const operationName =
      request.operationName || (request.query ? "unknown" : "");

    logger.info(`GraphQL request started: ${operationName || "unknown"}`);

    return {
      async didResolveOperation({ operationName, operation }) {
        logger.info(`GraphQL operation resolved: ${operationName}`, {
          operationType: operation?.operation,
        });
      },

      async didEncounterErrors({ errors, operation }) {
        logger.error(`Errors in operation: ${operation?.name?.value}`, {
          errorCount: errors.length,
          errors: errors.map((e) => ({
            message: e.message,
            code: e.extensions?.code,
          })),
        });
      },

      async willSendResponse({ errors }) {
        const duration = Date.now() - startTime;

        if (errors && errors.length > 0) {
          logger.warn(`Request completed with errors`, {
            duration,
            errorCount: errors.length,
          });
        } else {
          logger.info(`Request completed successfully`, {
            duration,
          });
        }
      },
    } as GraphQLRequestListener<GraphQLContext>;
  },

  async contextCreationDidFail({ error }) {
    logger.error("Context creation failed", error);
  },

  async unexpectedErrorProcessingRequest({ error }) {
    logger.error("Unexpected error processing request", error);
  },

  async invalidRequestWasReceived({ error }) {
    logger.warn("Invalid request received", error);
  },

  async startupDidFail({ error }) {
    logger.error("Server startup failed", error);
  },
};

/**
 * Initialize Apollo Server with enterprise configuration
 */
function createApolloServer(): ApolloServer<GraphQLContext> {
  const typeDefs = loadSchema();

  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  return new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    csrfPrevention: false,

    formatError: (error) => {
      logger.error("GraphQL Error formatted", {
        message: error.message,
        code: error.extensions?.code,
        path: error.path,
      });

      if (isProduction) {
        if (error.extensions?.code === "INTERNAL_SERVER_ERROR") {
          return {
            message: "An internal server error occurred",
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
            },
          };
        }
      }

      return error;
    },

    introspection: !isProduction,
    /**
     * Plugin execution order (bottom-up from request flow perspective):
     * 1. LoggingPlugin - Records all requests
     * 2. ComplexityPlugin - Analyzes query cost
     * 3. AuthPlugin - Enforces authorization
     * 4. ErrorBoundaryPlugin - Catches all errors and formats them
     * 5. serverPlugin - Legacy monitoring
     */
    plugins: [
      new LoggingPlugin(),
      new ComplexityPlugin(),
      new AuthPlugin(),
      new ErrorBoundaryPlugin(),
      serverPlugin,
    ],
    includeStacktraceInErrorResponses:
      isDevelopment || process.env.DEBUG === "true",
  });
}

let apolloServer: ApolloServer<GraphQLContext> | null = null;

function getApolloServer(): ApolloServer<GraphQLContext> {
  if (!apolloServer) {
    apolloServer = createApolloServer();
  }
  return apolloServer;
}

/**
 * Context creator for Next.js Apollo integration
 * Called ONCE per GraphQL request
 *
 * Creates fresh GraphQL context with:
 * - New DataLoaders (fresh batch window per request)
 * - New Services (fresh state per request)
 * - Isolated user auth per request
 *
 * This ensures:
 * - No N+1 query batching across requests
 * - No cache pollution between users
 * - Proper request isolation
 */
async function contextCreator(): Promise<GraphQLContext> {
  try {
    // Session is passed via req context if available
    const context = await createContext();

    logger.debug("GraphQL context created successfully", {
      requestId: context.requestId,
      authenticated: !!context.user,
    });

    return context;
  } catch (error) {
    logger.error("Failed to create GraphQL context", error);
    throw error;
  }
}

export const handler = startServerAndCreateNextHandler(getApolloServer(), {
  context: contextCreator,
});

export { getApolloServer as getServer };
