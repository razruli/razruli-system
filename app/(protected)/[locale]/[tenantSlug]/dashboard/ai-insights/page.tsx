"use client";

import { InsightsWidget } from "@/widgets/ai-assistant";

/**
 * AI Insights Page - Clean Orchestration
 *
 * FSD Structure:
 * Page → Widgets → Features/Entities/Shared
 *
 * This page orchestrates the insights widget which manages:
 * 1. Insight query state
 * 2. Batch loading and display
 * 3. Individual insight cards
 *
 * All AI analysis logic lives in:
 * - features/common/ai (for AI endpoint integration)
 * - widgets/ai-assistant/insights (for UI and state orchestration)
 */
export default function AIInsightsPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI Insights & Analysis</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered analysis of your workforce data, hiring needs, and
            capacity
          </p>
        </div>

        {/* Insights Widget - Handles all state and display */}
        <InsightsWidget />
      </div>
    </div>
  );
}
