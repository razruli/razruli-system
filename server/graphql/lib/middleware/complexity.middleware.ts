import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
} from "@apollo/server";
import { parse } from "graphql";

import { logger } from "@/server/utils/logger/logger";

/**
 * ComplexityPlugin: Estimates query complexity and logs warnings for expensive queries.
 *
 * Complexity scoring:
 * - Each field: +1
 * - Each list field: +10 (potential N+1)
 * - Nested depth multiplier: exponential
 *
 * Thresholds:
 * - Complexity > 1000: warning log
 * - Complexity > 5000: error log (but query still allowed)
 */
export class ComplexityPlugin implements ApolloServerPlugin<BaseContext> {
  private MAX_COMPLEXITY = 5000;
  private WARN_THRESHOLD = 1000;

  async requestDidStart(requestContext: any) {
    const { request } = requestContext;

    if (!request.query) {
      return;
    }

    try {
      const complexity = this.calculateComplexity(request.query);

      if (complexity > this.MAX_COMPLEXITY) {
        logger.error("Query complexity exceeds maximum", {
          complexity,
          maxAllowed: this.MAX_COMPLEXITY,
          query: request.query.substring(0, 100),
        } as any);
      } else if (complexity > this.WARN_THRESHOLD) {
        logger.warn("Query complexity warning", {
          complexity,
          threshold: this.WARN_THRESHOLD,
          query: request.query.substring(0, 100),
        });
      }
    } catch (error) {
      logger.debug("Failed to calculate query complexity", error as Error);
    }

    return {
      async didResolveOperation() {
        // Complexity already checked in requestDidStart
      },
    } as GraphQLRequestListener<BaseContext>;
  }

  private calculateComplexity(query: string): number {
    try {
      const ast = parse(query);
      let complexity = 0;

      if (ast.definitions) {
        for (const definition of ast.definitions) {
          if (
            definition.kind === "OperationDefinition" &&
            definition.selectionSet
          ) {
            complexity += this.calculateSelectionSetComplexity(
              definition.selectionSet,
              1,
            );
          }
        }
      }

      return complexity;
    } catch (error) {
      logger.debug("Failed to parse GraphQL query", error as Error);
      return 0;
    }
  }

  private calculateSelectionSetComplexity(
    selectionSet: any,
    depth: number,
  ): number {
    let complexity = 0;

    if (!selectionSet.selections) {
      return complexity;
    }

    for (const selection of selectionSet.selections) {
      if (selection.kind === "Field") {
        let fieldComplexity = 1;

        // Check if field name suggests it returns a list
        const fieldName = selection.name.value;
        const isListField = this.isListField(fieldName);

        if (isListField) {
          fieldComplexity *= 10;
        }

        // Add depth multiplier
        fieldComplexity *= Math.pow(1.5, depth);

        complexity += fieldComplexity;

        // Recurse into nested selections
        if (selection.selectionSet) {
          complexity += this.calculateSelectionSetComplexity(
            selection.selectionSet,
            depth + 1,
          );
        }
      } else if (
        selection.kind === "InlineFragment" &&
        selection.selectionSet
      ) {
        complexity += this.calculateSelectionSetComplexity(
          selection.selectionSet,
          depth,
        );
      } else if (selection.kind === "FragmentSpread") {
        // Skip fragment spreads (conservative estimate)
        complexity += 5;
      }
    }

    return complexity;
  }

  private isListField(fieldName: string): boolean {
    const lowerName = fieldName.toLowerCase();
    return (
      lowerName.includes("list") ||
      lowerName.includes("find") ||
      lowerName === "items" ||
      lowerName === "results" ||
      lowerName === "data" ||
      /s$/.test(fieldName)
    );
  }
}
