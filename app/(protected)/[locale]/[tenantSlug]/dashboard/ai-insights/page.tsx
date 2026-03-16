"use client";

import { BatchInsights, InsightsPanel } from "@/widgets/ai-assistant/insights";

/**
 * AI Insights Page - Clean Orchestration
 *
 * FSD Structure:
 * Page → Widgets → Features/Entities/Shared
 *
 * This page orchestrates insight widgets:
 * 1. BatchInsights - Auto-loading multi-panel insights
 * 2. InsightsPanel - Manual insight query management
 *
 * All AI analysis logic lives in:
 * - features/common/ai (for AI endpoint integration)
 * - widgets/ai-assistant/insights (for UI and state)
 */
export default function AIInsightsPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-auto">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">AI Insights & Analysis</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered analysis of your workforce data, hiring needs, and capacity
          </p>
        </div>

        {/* Batch Insights - Auto-loading panels */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <BatchInsights />
        </section>

        {/* Custom Insight Queries */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Custom Analysis</h2>
          <InsightsPanel />
        </section>
      </div>
    </div>
  );
}
