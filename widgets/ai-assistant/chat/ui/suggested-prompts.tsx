"use client";

import { AlertTriangle, BarChart3, Users, GitCompare, FileBarChart, Lightbulb } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/shadcn/card";
import type { SuggestedPrompt } from "../model/types";

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: AlertTriangle,
    label: "Critical Alert",
    text: "Which departments are critically overloaded right now?",
    color: "text-destructive",
  },
  {
    icon: BarChart3,
    label: "Workload Analysis",
    text: "/analyze all departments utilization",
    color: "text-primary",
  },
  {
    icon: Users,
    label: "Hiring Plan",
    text: "/suggest-hires for Engineering with moderate budget",
    color: "text-chart-2",
  },
  {
    icon: GitCompare,
    label: "Compare Teams",
    text: "/compare Engineering vs Marketing on efficiency, workload, growth",
    color: "text-chart-3",
  },
  {
    icon: FileBarChart,
    label: "Executive Report",
    text: "/report executive quarterly summary",
    color: "text-chart-4",
  },
  {
    icon: Lightbulb,
    label: "Strategy Advice",
    text: "Based on current workload data, what hiring decisions should I prioritize this quarter?",
    color: "text-chart-5",
  },
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {SUGGESTED_PROMPTS.map((prompt) => {
        const Icon = prompt.icon;
        return (
          <Card
            key={prompt.label}
            className="p-3 hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={() => onSelect(prompt.text)}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Icon className={`h-4 w-4 ${prompt.color} flex-shrink-0 mt-0.5`} />
                <p className="text-xs font-medium text-foreground">{prompt.label}</p>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{prompt.text}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
