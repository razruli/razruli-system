import { BarChart3, Users, GitCompare, FileBarChart } from "lucide-react";

import type { SlashCommand } from "../model/types";

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    command: "/analyze",
    description: "Analyze department workload",
    icon: BarChart3,
  },
  {
    command: "/suggest-hires",
    description: "Get hiring recommendations",
    icon: Users,
  },
  {
    command: "/compare",
    description: "Compare teams side by side",
    icon: GitCompare,
  },
  {
    command: "/report",
    description: "Generate a KPI report",
    icon: FileBarChart,
  },
];
