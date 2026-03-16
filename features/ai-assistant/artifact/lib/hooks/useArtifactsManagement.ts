import { useCallback } from "react";

import type { Artifact } from "@/entities/ai-assistant/artifact";

import { useArtifactsStore } from "../store/artifactsStore";

export function useArtifactsManagement() {
  const {
    artifacts,
    activeArtifactId,
    addArtifact,
    removeArtifact,
    setActiveArtifact,
    clearArtifacts,
  } = useArtifactsStore();

  const createArtifact = useCallback(
    (artifact: Artifact) => {
      addArtifact(artifact);
    },
    [addArtifact],
  );

  const deleteArtifact = useCallback(
    (artifactId: string) => {
      removeArtifact(artifactId);
    },
    [removeArtifact],
  );

  const selectArtifact = useCallback(
    (artifactId: string | null) => {
      setActiveArtifact(artifactId);
    },
    [setActiveArtifact],
  );

  const activeArtifact = artifacts.find((a) => a.id === activeArtifactId);

  return {
    artifacts,
    activeArtifact,
    activeArtifactId,
    createArtifact,
    deleteArtifact,
    selectArtifact,
    clearArtifacts,
  };
}
