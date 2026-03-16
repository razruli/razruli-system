"use client";

import { Loader2, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import type { Artifact } from "../model/types";

interface ArtifactViewerProps {
  artifact: Artifact;
  onClose: () => void;
}

export function ArtifactViewer({ artifact, onClose }: ArtifactViewerProps) {
  if (artifact.isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating {artifact.type.replace("-", " ")}...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{artifact.title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <pre className="bg-muted p-4 rounded-lg overflow-auto">
            {JSON.stringify(artifact.content, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
