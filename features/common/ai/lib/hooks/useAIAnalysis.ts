import { useCallback, useState } from "react";
import { useChat } from "ai/react";

export type AIAnalysisType =
  | "hiring-gap"
  | "data-insights"
  | "capacity-analysis"
  | "workforce-summary";

interface UseAIAnalysisOptions {
  type: AIAnalysisType;
  context?: Record<string, unknown>;
}

export function useAIAnalysis(options: UseAIAnalysisOptions) {
  const { type, context } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  const analyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const stream = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      });

      if (!stream.ok) {
        throw new Error(`Failed to analyze: ${stream.statusText}`);
      }

      const reader = stream.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Handle SSE format from useChat
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("0:")) {
            // Text message
            const text = line.slice(2);
            accumulatedResponse += text;
            setResponse(accumulatedResponse);
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("[AI Analysis Error]", err);
    } finally {
      setIsLoading(false);
    }
  }, [type, context]);

  return {
    isLoading,
    error,
    response,
    analyze,
  };
}
