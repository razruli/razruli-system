"use client";

import { AIInsightPanel } from "@/features/common/ai";

interface DashboardInsightsProps {
  companyMetrics?: Record<string, unknown>;
  departmentMetrics?: Record<string, unknown>;
  employeeMetrics?: Record<string, unknown>;
}

export function DashboardAIInsights({
  companyMetrics,
  departmentMetrics,
  employeeMetrics,
}: DashboardInsightsProps) {
  const dashboardContext = {
    companyMetrics,
    departmentMetrics,
    employeeMetrics,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Workforce Summary */}
      <AIInsightPanel
        type="workforce-summary"
        context={dashboardContext}
        title="Workforce Summary"
        description="Quick overview of your organization"
        autoAnalyze={true}
      />

      {/* Data Insights */}
      <AIInsightPanel
        type="data-insights"
        context={dashboardContext}
        title="Key Insights"
        description="Important patterns and recommendations"
        autoAnalyze={true}
      />
    </div>
  );
}
