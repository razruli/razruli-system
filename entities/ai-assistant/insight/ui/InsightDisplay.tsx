"use client";
import { ReactNode } from "react";

import { AlertCircle, Sparkles } from "lucide-react";

import { Skeleton } from "@/shared/ui";
import { Alert, AlertDescription } from "@/shared/ui/shadcn/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

interface InsightDisplayProps {
  title: string;
  content: string | ReactNode;
  type?:
    | "hiring-gap"
    | "data-insights"
    | "capacity-analysis"
    | "workforce-summary";
  isLoading?: boolean;
  error?: string | null;
  description?: string;
}

/**
 * InsightDisplay - Visual representation of Insight entity
 *
 * This component displays an insight with:
 * - Title and optional description
 * - Loading skeleton
 * - Error state
 * - Formatted content (with gradient background)
 *
 * Location: entities/ai-assistant/insight/ui
 * Reason: IS THE VISUAL REPRESENTATION OF THE INSIGHT TYPE
 */
export function InsightDisplay({
  title,
  content,
  type,
  isLoading = false,
  error = null,
  description,
}: InsightDisplayProps) {
  return (
    <Card className="border-amber-200/50 bg-linear-to-br from-amber-50/50 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <div className="flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-sm text-foreground/80 leading-relaxed">
            {typeof content === "string" ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              content
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
