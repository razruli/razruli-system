import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Artifact, ArtifactState } from "../model/types";

export const useArtifactStore = create<
  ArtifactState & {
    addArtifact: (artifact: Artifact) => void;
    removeArtifact: (artifactId: string) => void;
    setActiveArtifact: (artifactId: string | null) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    clearArtifacts: () => void;
  }
>(
  immer((set) => ({
    artifacts: [],
    activeArtifactId: null,
    isGenerating: false,

    addArtifact: (artifact: Artifact) =>
      set((state) => {
        state.artifacts.push(artifact);
        state.activeArtifactId = artifact.id;
      }),

    removeArtifact: (artifactId: string) =>
      set((state) => {
        state.artifacts = state.artifacts.filter((a) => a.id !== artifactId);
        if (state.activeArtifactId === artifactId) {
          state.activeArtifactId = state.artifacts[0]?.id || null;
        }
      }),

    setActiveArtifact: (artifactId: string | null) =>
      set((state) => {
        state.activeArtifactId = artifactId;
      }),

    setIsGenerating: (isGenerating: boolean) =>
      set((state) => {
        state.isGenerating = isGenerating;
      }),

    clearArtifacts: () =>
      set({
        artifacts: [],
        activeArtifactId: null,
        isGenerating: false,
      }),
  }))
);
