"use client";

import { Plus, Loader2 } from "lucide-react";

import { InsightDisplay } from "@/entities/ai-assistant/insight";
import { Button, Skeleton } from "@/shared/ui";

import { useInsightsWidget } from "../model";

/**
 * InsightsWidget UI - Uses widget model exclusively
 *
 * The model (lib/model/useInsightsWidget) orchestrates:
 * - features/ai-assistant/insight-query: Query state management
 * - features/ai-assistant/insight-query hooks: Batch loading
 *
 * Widget displays:
 * - Grid of insight cards (using entity InsightDisplay)
 * - Loading/error states
 * - Refresh actions
 */
export function InsightsWidget() {
  const { queries, isLoadingBatch, handleRemove, handleRefresh } =
    useInsightsWidget();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
          <p className="text-sm text-muted-foreground">
            Analyze your hiring and capacity data
          </p>
        </div>
        <Button onClick={handleRefresh}>
          <Plus className="h-4 w-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {queries.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <p>No insights yet. Create a new insight to get started.</p>
          </div>
        ) : (
          queries.map((query) => (
            <div key={query.id} className="rounded-lg border bg-card p-4">
              {query.status === "loading" || isLoadingBatch ? (
                <Skeleton className="h-32" />
              ) : query.error ? (
                <div className="text-sm text-destructive">{query.error}</div>
              ) : (
                <InsightDisplay
                  title={query.title || "No Title"}
                  content={query.result || ""}
                  type={query.type}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full"
                onClick={() => handleRemove(query.id)}
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>

      {isLoadingBatch && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading insights...
        </div>
      )}
    </div>
  );
}
