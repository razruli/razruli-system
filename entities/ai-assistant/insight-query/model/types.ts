export type InsightType = "hiring-gap" | "data-insights" | "capacity-analysis" | "workforce-summary";
export type InsightStatus = "pending" | "loading" | "success" | "error";

export interface InsightQuery {
  id: string;
  type: InsightType;
  context?: Record<string, unknown>;
  title?: string;
  status: InsightStatus;
  result?: string;
  error?: string;
  createdAt: Date;
}
