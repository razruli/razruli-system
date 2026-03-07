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
import type {
  FilterInput,
  PaginationInput,
  PaginatedResult,
} from "@/server/services/base/pagination";

export class GapAnalysisRepository extends BaseRepository<GapAnalysisResult> {
  protected readonly modelName = "gapAnalysisResult" as const;

  // ==================== READ OPERATIONS ====================

  async findAll(): Promise<GapAnalysisResult[]> {
    return this.prisma.gapAnalysisResult.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find gap analyses with filtering and pagination
   * Supports filtering by companyId, departmentId, and date range
   */
  async find(
    filter?: FilterInput,
    pagination?: PaginationInput,
  ): Promise<PaginatedResult<GapAnalysisResult>> {
    return this.findWithPagination(filter, pagination);
  }

  /**
   * Get latest gap analysis for a company
   */
  async findLatestForCompany(
    companyId: string,
  ): Promise<GapAnalysisResult | null> {
    return this.prisma.gapAnalysisResult.findFirst({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get latest gap analysis for a department
   */
  async findLatestForDepartment(
    departmentId: string,
  ): Promise<GapAnalysisResult | null> {
    return this.prisma.gapAnalysisResult.findFirst({
      where: { departmentId },
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
