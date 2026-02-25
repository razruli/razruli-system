// ============================================================================
// GapAnalysis Repository
// ============================================================================
// Handles ALL database access for GapAnalysis domain
// ============================================================================

import type {
  GapAnalysisResult,
  Prisma,
} from "@/server/db/generated/prisma/client";
import { BaseRepository } from "@/server/services/base/BaseRepository";

export class GapAnalysisRepository extends BaseRepository<GapAnalysisResult> {
  protected readonly modelName = "gapAnalysisResult" as const;

  // ==================== READ OPERATIONS ====================

  async findAll(): Promise<GapAnalysisResult[]> {
    return this.prisma.gapAnalysisResult.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(
    data: Prisma.GapAnalysisResultCreateInput,
  ): Promise<GapAnalysisResult> {
    return this.prisma.gapAnalysisResult.create({ data });
  }
}
