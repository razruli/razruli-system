"use client";

import { X, Download, Copy } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";

import { useArtifactWidget } from "../model";

/**
 * ArtifactWidget UI - Uses widget model exclusively
 *
 * The model (lib/model/useArtifactWidget) orchestrates:
 * - features/ai-assistant/artifact: Artifact state management
 *
 * Widget handles:
 * - Modal open/close
 * - Tab navigation
 * - Copy/download actions
 */
export function ArtifactWidget() {
  const {
    artifacts,
    activeArtifact,
    activeArtifactId,
    copied,
    isOpen,
    selectArtifact,
    handleCopy,
    handleDownload,
    handleClose,
    handleRemove,
  } = useArtifactWidget();

  if (artifacts.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{activeArtifact?.title}</DialogTitle>
        </DialogHeader>

        {/* Artifact Tabs */}
        {artifacts.length > 1 && (
          <Tabs
            value={activeArtifactId || ""}
            onValueChange={selectArtifact}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              {artifacts.map((artifact) => (
                <TabsTrigger key={artifact.id} value={artifact.id}>
                  {artifact.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Artifact Content */}
        <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4 border">
          <pre className="text-xs whitespace-pre-wrap wrap-break-word font-mono">
            {activeArtifact?.content}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
