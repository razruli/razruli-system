"use client";

import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  BarChart3,
  Users,
  FileBarChart,
  GitCompare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { Progress } from "@/shared/ui/shadcn/progress";

// --- Loading state ---
export function ArtifactLoading({ message }: { message: string }) {
  return (
    <Card className="border-primary/20 bg-primary/5 animate-pulse">
      <CardContent className="flex items-center gap-3 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </CardContent>
    </Card>
  );
}

// --- Workload Analysis artifact ---
interface WorkloadData {
  department: string;
  current: number;
  target: number;
  headcount: number;
  openRoles: number;
  trend: string;
}

export function WorkloadAnalysisArtifact({
  data,
  insights,
  metric,
}: {
  data: WorkloadData[];
  insights: string[];
  metric: string;
}) {
  const chartData = data.map((d) => ({
    name: d.department,
    current: d.current,
    target: d.target,
  }));

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Workload Analysis</CardTitle>
          <Badge variant="secondary" className="ml-auto text-xs">
            {metric}
          </Badge>
        </div>
        <CardDescription>
          Department utilization vs target capacity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Chart */}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                }}
              />
              <Bar
                dataKey="current"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                name="Current"
              />
              <Bar
                dataKey="target"
                fill="var(--muted)"
                radius={[4, 4, 0, 0]}
                name="Target"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department detail cards */}
        <div className="grid gap-2">
          {data.map((dept) => (
            <div
              key={dept.department}
              className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{dept.department}</span>
                  {dept.current > 85 ? (
                    <Badge
                      variant="destructive"
                      className="text-[10px] px-1.5 py-0"
                    >
                      Over capacity
                    </Badge>
                  ) : dept.current > 75 ? (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      Near target
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      Healthy
                    </Badge>
                  )}
                </div>
                <Progress value={dept.current} className="mt-1.5 h-1.5" />
              </div>
              <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                <span className="font-mono font-semibold text-foreground">
                  {dept.current}%
                </span>{" "}
                / {dept.target}%
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <span className="block">{dept.headcount} people</span>
                <span className="text-primary">{dept.openRoles} open</span>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Key Insights
          </p>
          <ul className="flex flex-col gap-1.5">
            {insights.map((insight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-foreground"
              >
                {insight.includes("above") ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                )}
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Hiring Recommendations artifact ---
interface HiringRecommendation {
  department: string;
  role: string;
  priority: string;
  count: number;
  estimatedSalary: string;
  impact: string;
  reasoning: string;
}

export function HiringRecommendationsArtifact({
  recommendations,
  summary,
  budget,
}: {
  recommendations: HiringRecommendation[];
  summary: { totalHires: number; totalBudget: string; criticalRoles: number };
  budget: string;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Hiring Recommendations</CardTitle>
          <Badge variant="secondary" className="ml-auto text-xs">
            {budget}
          </Badge>
        </div>
        <CardDescription>
          {summary.totalHires} recommended hires | {summary.totalBudget}{" "}
          estimated budget
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border/60 p-3 text-center">
            <p className="text-2xl font-bold text-primary">
              {summary.totalHires}
            </p>
            <p className="text-xs text-muted-foreground">Total Hires</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">
              {summary.totalBudget}
            </p>
            <p className="text-xs text-muted-foreground">Est. Budget</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3 text-center">
            <p className="text-2xl font-bold text-destructive">
              {summary.criticalRoles}
            </p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
        </div>

        {/* Recommendations table */}
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Dept</TableHead>
                <TableHead className="text-xs">Priority</TableHead>
                <TableHead className="text-xs text-right">#</TableHead>
                <TableHead className="text-xs text-right">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map((rec, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-medium">
                    {rec.role}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {rec.department}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        rec.priority === "Critical"
                          ? "destructive"
                          : rec.priority === "High"
                            ? "default"
                            : "secondary"
                      }
                      className="text-[10px] px-1.5 py-0"
                    >
                      {rec.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono">
                    {rec.count}
                  </TableCell>
                  <TableCell className="text-xs text-right text-primary font-medium">
                    {rec.impact}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Team Comparison artifact ---
interface ComparisonData {
  department: string;
  metrics: Record<string, number>;
}

export function TeamComparisonArtifact({
  comparison,
  metrics,
}: {
  comparison: ComparisonData[];
  metrics: string[];
}) {
  const radarData = metrics.map((m) => {
    const entry: Record<string, string | number> = { metric: m };
    comparison.forEach((c) => {
      entry[c.department] = c.metrics[m] ?? 0;
    });
    return entry;
  });

  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Team Comparison</CardTitle>
        </div>
        <CardDescription>
          Comparing {comparison.map((c) => c.department).join(" vs ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid className="stroke-border" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              {comparison.map((c, i) => (
                <Radar
                  key={c.department}
                  name={c.department}
                  dataKey={c.department}
                  stroke={colors[i % colors.length]}
                  fill={colors[i % colors.length]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Report artifact ---
interface ReportKPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export function ReportArtifact({
  kpis,
  reportType,
  timeframe,
}: {
  kpis: ReportKPI[];
  reportType: string;
  timeframe: string;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" />
          <CardTitle className="text-base capitalize">
            {reportType} Report
          </CardTitle>
          <Badge variant="secondary" className="ml-auto text-xs capitalize">
            {timeframe}
          </Badge>
        </div>
        <CardDescription>Key performance indicators overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex flex-col gap-1 rounded-lg border border-border/60 p-3"
            >
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <span className="text-xl font-bold text-foreground font-mono">
                {kpi.value}
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.trend === "up" &&
                  (kpi.label.includes("Time") || kpi.label.includes("Budget"))
                    ? "text-destructive"
                    : kpi.trend === "up"
                      ? "text-primary"
                      : kpi.label.includes("Open")
                        ? "text-primary"
                        : "text-destructive"
                }`}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {kpi.change}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
