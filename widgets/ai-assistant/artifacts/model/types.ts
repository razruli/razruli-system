export interface Artifact {
  id: string;
  type: "workload-analysis" | "hiring-recommendations" | "team-comparison" | "report";
  title: string;
  content: any;
  generatedAt: Date;
  isLoading?: boolean;
}

export interface ArtifactState {
  artifacts: Artifact[];
  activeArtifactId: string | null;
  isGenerating: boolean;
}
