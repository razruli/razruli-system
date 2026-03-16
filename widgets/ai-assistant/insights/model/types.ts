export interface InsightQuery {
  id: string;
  type: "hiring-gap" | "data-insights" | "capacity-analysis" | "workforce-summary";
  context?: Record<string, unknown>;
  title?: string;
  status: "pending" | "loading" | "success" | "error";
}

export interface InsightsState {
  queries: InsightQuery[];
  activeQueryId: string | null;
}
