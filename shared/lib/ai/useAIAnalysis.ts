"use client";

import { useState, useCallback, useEffect } from "react";

export type AnalysisType =
  | "hiring-gap"
  | "data-insights"
  | "capacity-analysis"
  | "workforce-summary";

export interface AIAnalysisContext {
  departmentStats?: Record<string, unknown>;
  employeeData?: unknown[];
  vacancies?: unknown[];
  [key: string]: unknown;
}

export interface UseAIAnalysisOptions {
  type: AnalysisType;
  context?: AIAnalysisContext;
  autoAnalyze?: boolean;
}

export interface UseAIAnalysisResult {
  isLoading: boolean;
  error: string | null;
  response: string | null;
  analyze: () => Promise<void>;
}

/**
 * useAIAnalysis Hook - Shared infrastructure for AI streaming
 *
 * Location: shared/lib/ai
 * Reason: Cross-cutting infrastructure for calling /api/ai/analyze endpoint
 *
 * Usage:
 * ```typescript
 * const { isLoading, error, response, analyze } = useAIAnalysis({
 *   type: "hiring-gap",
 *   context: { departmentStats: {...} }
 * });
 *
 * // Manually trigger analysis
 * await analyze();
 * ```
 */
export function useAIAnalysis(
  options: UseAIAnalysisOptions,
): UseAIAnalysisResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: options.type,
          context: options.context,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error("No response body received");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setResponse(fullResponse);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("AI Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [options.type, options.context]);

  // Auto-analyze if requested
  useEffect(() => {
    if (options.autoAnalyze) {
      analyze();
    }
  }, [options.autoAnalyze, analyze]);

  return {
    isLoading,
    error,
    response,
    analyze,
  };
}
