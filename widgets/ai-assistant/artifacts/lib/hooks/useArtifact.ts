import { useCallback } from "react";
import { useArtifactStore } from "../store/artifactStore";
import type { Artifact } from "../../model/types";

export function useArtifact() {
  const { artifacts, activeArtifactId, isGenerating, addArtifact, removeArtifact, setActiveArtifact, setIsGenerating, clearArtifacts } = useArtifactStore();

  const createArtifact = useCallback(
    (artifact: Artifact) => {
      addArtifact(artifact);
    },
    [addArtifact]
  );

  const deleteArtifact = useCallback(
    (artifactId: string) => {
      removeArtifact(artifactId);
    },
    [removeArtifact]
  );

  const selectArtifact = useCallback(
    (artifactId: string) => {
      setActiveArtifact(artifactId);
    },
    [setActiveArtifact]
  );

  const activeArtifact = artifacts.find((a) => a.id === activeArtifactId);

  return {
    artifacts,
    activeArtifact,
    activeArtifactId,
    isGenerating,
    createArtifact,
    deleteArtifact,
    selectArtifact,
    setIsGenerating,
    clearArtifacts,
  };
}
