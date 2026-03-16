"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useBatchInsights } from "../lib/hooks/useBatchInsights";
import { AIInsightPanel } from "@/features/common/ai";

export function BatchInsights() {
  const { context, isLoadingContext, loadBatchContext } = useBatchInsights();

  useEffect(() => {
    loadBatchContext();
  }, [loadBatchContext]);

  if (isLoadingContext) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading insights...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AIInsightPanel
        type="workforce-summary"
        context={context}
        title="Workforce Summary"
        autoAnalyze={true}
      />
      <AIInsightPanel
        type="capacity-analysis"
        context={context}
        title="Capacity Analysis"
        autoAnalyze={true}
      />
      <AIInsightPanel
        type="hiring-gap"
        context={context}
        title="Hiring Gap Analysis"
      />
      <AIInsightPanel
        type="data-insights"
        context={context}
        title="Data Insights"
      />
    </div>
  );
}
