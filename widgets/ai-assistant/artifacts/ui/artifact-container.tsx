"use client";

import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { X } from "lucide-react";
import { useArtifact } from "../lib/hooks/useArtifact";
import { ArtifactViewer } from "./artifact-viewer";

export function ArtifactContainer() {
  const { artifacts, activeArtifact, activeArtifactId, selectArtifact, deleteArtifact } = useArtifact();

  if (artifacts.length === 0) {
    return null;
  }

  return (
    <div className="border-l bg-muted/50 h-full flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col">
        {artifacts.length > 1 ? (
          <Tabs value={activeArtifactId || ""} onValueChange={selectArtifact} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 px-4 pt-4">
              {artifacts.map((artifact) => (
                <TabsTrigger key={artifact.id} value={artifact.id} className="text-xs">
                  {artifact.type}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex-1 min-h-0 overflow-hidden p-4">
              {artifacts.map((artifact) => (
                <TabsContent key={artifact.id} value={artifact.id} className="h-full">
                  <ArtifactViewer artifact={artifact} onClose={() => deleteArtifact(artifact.id)} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        ) : (
          activeArtifact && (
            <div className="flex-1 p-4 overflow-hidden">
              <ArtifactViewer artifact={activeArtifact} onClose={() => deleteArtifact(activeArtifact.id)} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
