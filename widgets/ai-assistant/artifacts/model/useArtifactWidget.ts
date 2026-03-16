"use client";

import { useCallback, useState } from "react";

import { useArtifactsManagement } from "@/features/ai-assistant/artifact";

/**
 * Widget Model: Orchestrates artifact feature
 *
 * This hook manages artifact widget behavior:
 * - Modal open/close
 * - Copy to clipboard feedback
 * - Download coordination
 *
 * Widget UI consumes ONLY this hook
 */
export function useArtifactWidget() {
  const {
    artifacts,
    activeArtifact,
    activeArtifactId,
    selectArtifact,
    deleteArtifact,
  } = useArtifactsManagement();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (activeArtifact) {
      navigator.clipboard.writeText(activeArtifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [activeArtifact]);

  const handleDownload = useCallback(() => {
    if (activeArtifact) {
      const element = document.createElement("a");
      const file = new Blob([activeArtifact.content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${activeArtifact.title}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }, [activeArtifact]);

  const handleClose = useCallback(() => {
    selectArtifact(null);
  }, [selectArtifact]);

  const handleRemove = useCallback(() => {
    if (activeArtifactId) deleteArtifact(activeArtifactId);
    selectArtifact(null);
  }, [activeArtifactId, deleteArtifact, selectArtifact]);

  return {
    artifacts,
    activeArtifact,
    activeArtifactId,
    copied,
    isOpen: !!activeArtifactId,
    selectArtifact,
    handleCopy,
    handleDownload,
    handleClose,
    handleRemove,
  };
}
