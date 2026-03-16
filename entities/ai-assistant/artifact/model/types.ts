export type ArtifactType =
  | "workload-analysis"
  | "hiring-recommendations"
  | "team-comparison"
  | "report";

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: string;
  generatedAt: Date;
}
