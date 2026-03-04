// ============================================================================
// Grade Service
// ============================================================================
// Business logic for Grade domain (reference data)
// Uses GradeRepository for all DB access
// ============================================================================

import type { Grade } from "@/server/db/generated/prisma/client";
import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { GradeRepository } from "./Grade.repository";

export class GradeService extends BaseService {
  readonly domain = "grade";
  private repository: GradeRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new GradeRepository(context.prisma);
  }

  // ==================== READ OPERATIONS ====================

  async getById(id: string): Promise<Grade | null> {
    this.log("info", `Getting grade by ID`, { id });
    const cacheKey = this.cacheKey(id);

    return await this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Grade> {
    const grade = await this.getById(id);
    return this.ensureExists(grade, "Grade", id);
  }

  async getByIds(ids: string[]): Promise<(Grade | null)[]> {
    if (ids.length === 0) return [];

    return this.repository.findMany(ids.map(String));
  }

  async getAll(): Promise<Grade[]> {
    const cacheKey = this.listCacheKey({});

    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  // ==================== WRITE OPERATIONS ====================

  //   async create(data: {
  //     name: string;
  //     description?: string;
  //     kGrade: number;
  //   }): Promise<Grade> {
  //     this.log("info", `Creating grade`, { name: data.name });

  //     this.validate(data.name, "Grade name required");
  //     this.validateCondition(data.kGrade > 0, "kGrade must be positive");

  //     // Check for duplicate name
  //     const existing = await this.repository.findByName(data.name);

  //     if (existing) {
  //       throw new this.ValidationError(`Grade "${data.name}" already exists`);
  //     }

  //     const grade = await this.repository.create({

  //       name: data.name,
  //       description: undefined,
  //       kGrade: data.kGrade,
  //     });

  //     this.log("info", `Grade created`, { id: grade.id });

  //     this.invalidateAll();

  //     return grade;
  //   }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      kGrade: number;
    }>,
  ): Promise<Grade> {
    this.log("info", `Updating grade`, { id });

    await this.getByIdOrThrow(id);

    const updated = await this.repository.update(String(id), data);

    this.invalidate(id);
    this.invalidateAll();

    return updated;
  }

  // ==================== BUSINESS LOGIC ====================

  async getWithStats(id: string) {
    const grade = await this.getByIdOrThrow(id);

    const employeeCount = await this.repository.getEmployeeCount(id);

    return {
      ...grade,
      stats: {
        employees: employeeCount,
      },
    };
  }
}
