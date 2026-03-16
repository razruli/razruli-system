"use client";

import { useCallback } from "react";
import { AIInsightPanel } from "@/features/common/ai";

interface HiringAnalyticsPageProps {
  departmentStats?: Record<string, unknown>;
  employeeData?: Record<string, unknown>;
  vacancies?: Record<string, unknown>;
}

export function HiringAnalyticsView({
  departmentStats,
  employeeData,
  vacancies,
}: HiringAnalyticsPageProps) {
  const hiringContext = {
    departmentStats,
    employeeData,
    vacancies,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Existing hiring analytics content */}
      
      {/* AI-Powered Hiring Gap Analysis */}
      <AIInsightPanel
        type="hiring-gap"
        context={hiringContext}
        title="AI Hiring Gap Analysis"
        description="Get AI-powered recommendations for your hiring strategy"
        autoAnalyze={false}
      />

      {/* AI-Powered Capacity Analysis */}
      <AIInsightPanel
        type="capacity-analysis"
        context={hiringContext}
        title="Capacity & Workload Analysis"
        description="Understand your team's capacity and workload distribution"
      />
    </div>
  );
}
