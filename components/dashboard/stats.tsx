"use client";

import {
  Users,
  Building2,
  Workflow,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Badge } from "@/shared/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { Progress } from "@/shared/ui/shadcn/progress";

const stats = [
  {
    title: "Total Employees",
    value: "248",
    change: "+12",
    trend: "up" as const,
    description: "from last quarter",
    icon: Users,
  },
  {
    title: "Departments",
    value: "14",
    change: "+2",
    trend: "up" as const,
    description: "new this year",
    icon: Building2,
  },
  {
    title: "Active Processes",
    value: "67",
    change: "-3",
    trend: "down" as const,
    description: "optimized this month",
    icon: Workflow,
  },
  {
    title: "Avg. Workload",
    value: "78%",
    change: "+5%",
    trend: "up" as const,
    description: "capacity utilization",
    icon: TrendingUp,
  },
];

const departmentWorkload = [
  { name: "Engineering", capacity: 92, headcount: 68, status: "critical" },
  { name: "Marketing", capacity: 78, headcount: 32, status: "moderate" },
  { name: "Sales", capacity: 65, headcount: 45, status: "healthy" },
  { name: "Operations", capacity: 85, headcount: 28, status: "moderate" },
  { name: "Product", capacity: 71, headcount: 22, status: "healthy" },
  { name: "HR", capacity: 58, headcount: 15, status: "healthy" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "critical":
      return "text-destructive";
    case "moderate":
      return "text-chart-4";
    default:
      return "text-chart-3";
  }
}

function getProgressColor(capacity: number) {
  if (capacity >= 90)
    return "[&>[data-slot=progress-indicator]]:bg-destructive";
  if (capacity >= 75) return "[&>[data-slot=progress-indicator]]:bg-chart-4";
  return "";
}

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {stat.trend === "up" ? (
                <ArrowUpRight className="size-3 text-chart-4" />
              ) : (
                <ArrowDownRight className="size-3 text-primary" />
              )}
              <span
                className={`text-xs font-medium ${stat.trend === "up" ? "text-chart-4" : "text-primary"}`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DepartmentWorkloadCards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Department Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {departmentWorkload.map((dept) => (
            <div key={dept.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {dept.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {dept.headcount} people
                  </Badge>
                </div>
                <span
                  className={`text-sm font-semibold ${getStatusColor(dept.status)}`}
                >
                  {dept.capacity}%
                </span>
              </div>
              <Progress
                value={dept.capacity}
                className={`h-2 ${getProgressColor(dept.capacity)}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
