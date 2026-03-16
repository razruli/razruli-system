"use client";

import { AIInsightPanel } from "@/features/common/ai";
import { useInsights } from "../lib/hooks/useInsights";
import { Card } from "@/shared/ui/shadcn/card";
import { Button } from "@/shared/ui/button";
import { Plus, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { InsightQuery } from "../model/types";

interface InsightsPanelProps {
  queries?: InsightQuery[];
  onAddQuery?: (type: InsightQuery["type"]) => void;
}

export function InsightsPanel({ queries: initialQueries, onAddQuery }: InsightsPanelProps) {
  const { queries, activeQuery, activeQueryId, setActiveQuery, removeQuery } = useInsights();

  const displayQueries = initialQueries || queries;

  if (displayQueries.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No insights yet</p>
        <Button onClick={() => onAddQuery?.("data-insights")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Insight
        </Button>
      </Card>
    );
  }

  return (
    <Tabs value={activeQueryId || displayQueries[0]?.id || ""} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          {displayQueries.map((query) => (
            <TabsTrigger key={query.id} value={query.id} className="text-xs">
              {query.title || query.type}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button variant="outline" size="sm" onClick={() => onAddQuery?.("data-insights")}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {displayQueries.map((query) => (
        <TabsContent key={query.id} value={query.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{query.title || query.type}</h3>
            <Button variant="ghost" size="sm" onClick={() => removeQuery(query.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AIInsightPanel type={query.type} context={query.context} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
