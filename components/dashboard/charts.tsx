"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/ui/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";

const workloadByDepartment = [
  { name: "Eng", current: 92, target: 80 },
  { name: "Mktg", current: 78, target: 75 },
  { name: "Sales", current: 65, target: 70 },
  { name: "Ops", current: 85, target: 75 },
  { name: "Product", current: 71, target: 70 },
  { name: "HR", current: 58, target: 60 },
  { name: "Finance", current: 74, target: 70 },
  { name: "Legal", current: 62, target: 65 },
];

const hiringTrend = [
  { month: "Jul", hires: 4, departures: 2, openPositions: 8 },
  { month: "Aug", hires: 6, departures: 1, openPositions: 10 },
  { month: "Sep", hires: 3, departures: 3, openPositions: 9 },
  { month: "Oct", hires: 8, departures: 2, openPositions: 12 },
  { month: "Nov", hires: 5, departures: 4, openPositions: 11 },
  { month: "Dec", hires: 2, departures: 1, openPositions: 8 },
  { month: "Jan", hires: 7, departures: 2, openPositions: 14 },
  { month: "Feb", hires: 9, departures: 3, openPositions: 16 },
  { month: "Mar", hires: 6, departures: 1, openPositions: 13 },
];

const processDistribution = [
  { name: "Customer-facing", value: 28, color: "var(--color-chart-1)" },
  { name: "Internal Ops", value: 19, color: "var(--color-chart-2)" },
  { name: "R&D", value: 12, color: "var(--color-chart-3)" },
  { name: "Support", value: 8, color: "var(--color-chart-4)" },
];

const skillRadar = [
  { skill: "Leadership", current: 72, required: 85 },
  { skill: "Technical", current: 88, required: 90 },
  { skill: "Communication", current: 65, required: 80 },
  { skill: "Analytics", current: 78, required: 85 },
  { skill: "Strategy", current: 60, required: 75 },
  { skill: "Operations", current: 82, required: 80 },
];

function CustomTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-xs text-muted-foreground">
          <span
            className="inline-block size-2 rounded-full mr-1.5"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-medium text-foreground">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export function WorkloadChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-foreground">
          Workload vs Target by Department
        </CardTitle>
        <CardDescription>
          Current capacity utilization compared to targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadByDepartment} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Bar
                dataKey="current"
                name="Current"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="target"
                name="Target"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
                barSize={20}
                opacity={0.6}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function HiringTrendChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Hiring Trend</CardTitle>
            <CardDescription>Monthly hiring and departure data</CardDescription>
          </div>
          <Tabs defaultValue="area">
            <TabsList>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hiringTrend}>
              <defs>
                <linearGradient id="hiresGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-chart-3)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-chart-3)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Area
                type="monotone"
                dataKey="openPositions"
                name="Open Positions"
                stroke="var(--color-chart-3)"
                fill="url(#openGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="hires"
                name="Hires"
                stroke="var(--color-chart-1)"
                fill="url(#hiresGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="departures"
                name="Departures"
                stroke="var(--color-chart-5)"
                fill="none"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProcessDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Process Distribution</CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {processDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                      <p className="text-xs font-medium text-foreground">
                        {data.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.value} processes
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {processDistribution.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SkillGapChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Skill Gap Analysis</CardTitle>
        <CardDescription>Current vs required competencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillRadar} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              />
              <Radar
                name="Required"
                dataKey="required"
                stroke="var(--color-chart-2)"
                fill="var(--color-chart-2)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="var(--color-chart-1)"
                fill="var(--color-chart-1)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  color: "var(--color-muted-foreground)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
