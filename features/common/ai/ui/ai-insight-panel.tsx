"use client";

import { useEffect, useState } from "react";
import { useAIAnalysis, AIAnalysisType } from "../lib/hooks/useAIAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, AlertCircle, Zap } from "lucide-react";

interface AIInsightPanelProps {
  type: AIAnalysisType;
  context?: Record<string, unknown>;
  title?: string;
  description?: string;
  className?: string;
  autoAnalyze?: boolean;
}

export function AIInsightPanel({
  type,
  context,
  title,
  description,
  className,
  autoAnalyze = false,
}: AIInsightPanelProps) {
  const { isLoading, error, response, analyze } = useAIAnalysis({ type, context });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    if (autoAnalyze && !hasAnalyzed) {
      analyze();
      setHasAnalyzed(true);
    }
  }, [autoAnalyze, hasAnalyzed, analyze]);

  const defaultTitle = 
    type === "hiring-gap"
      ? "Hiring Gap Analysis"
      : type === "data-insights"
        ? "Data Insights"
        : type === "capacity-analysis"
          ? "Capacity Analysis"
          : "Workforce Summary";

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 ${className || ""}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-base">{title || defaultTitle}</CardTitle>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          {!hasAnalyzed && (
            <Button
              onClick={() => {
                analyze();
                setHasAnalyzed(true);
              }}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Get Insights
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error generating insights</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {isLoading && !response && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Analyzing data...
            </span>
          </div>
        )}

        {response && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-black/20 rounded p-4">
              {response}
            </div>
          </div>
        )}

        {!response && !isLoading && hasAnalyzed && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No insights generated
          </p>
        )}
      </CardContent>
    </Card>
  );
}
