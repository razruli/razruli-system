import { create } from "zustand";

import type { Artifact } from "@/entities/ai-assistant/artifact";

interface ArtifactsState {
  artifacts: Artifact[];
  activeArtifactId: string | null;
  addArtifact: (artifact: Artifact) => void;
  removeArtifact: (artifactId: string) => void;
  setActiveArtifact: (artifactId: string | null) => void;
  clearArtifacts: () => void;
}

export const useArtifactsStore = create<ArtifactsState>((set) => ({
  artifacts: [],
  activeArtifactId: null,

  addArtifact: (artifact: Artifact) =>
    set((state) => ({
      artifacts: [...state.artifacts, artifact],
      activeArtifactId: artifact.id,
    })),

  removeArtifact: (artifactId: string) =>
    set((state) => {
      const filtered = state.artifacts.filter((a) => a.id !== artifactId);
      return {
        artifacts: filtered,
        activeArtifactId:
          state.activeArtifactId === artifactId
            ? filtered[0]?.id || null
            : state.activeArtifactId,
      };
    }),

  setActiveArtifact: (artifactId: string | null) =>
    set({
      activeArtifactId: artifactId,
    }),

  clearArtifacts: () =>
    set({
      artifacts: [],
      activeArtifactId: null,
    }),
}));
