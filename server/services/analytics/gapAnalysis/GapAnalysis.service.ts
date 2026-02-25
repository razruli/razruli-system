// ============================================================================
// GapAnalysis Service
// ============================================================================
// Business logic for GapAnalysis domain
// ============================================================================

import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { GapAnalysisRepository } from "./GapAnalysis.repository";

export class GapAnalysisService extends BaseService {
  readonly domain = "gapAnalysis";
  private repository: GapAnalysisRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new GapAnalysisRepository(context.prisma);
  }

  async getById(id: string) {
    const cacheKey = this.cacheKey(id);
    return this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getAll() {
    const cacheKey = this.listCacheKey({});
    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  async create(data: any) {
    const item = await this.repository.create(data);
    this.invalidateAll();
    return item;
  }

  async analyzeDepartmentCapacityCoverage(departmentId: string) {
    this.log("info", `Analyzing capacity coverage for department`, {
      departmentId,
    });

    const cacheKey = this.cacheKey(departmentId);

    return this.getOrFetch(cacheKey, async () => {
      // Get all employees in department
      const employees = await this.context.prisma.employee.findMany({
        where: { departmentId },
      });

      // Calculate total capacity
      let totalCapacity = 0;
      for (const employee of employees) {
        // Base capacity: 100 CU/month per employee
        const gradeMultiplier = 1 + employee.gradeId * 0.1;
        const kEfficiency = employee.kEfficiency || 1.0;
        const monthlyCapacity = 100 * gradeMultiplier * kEfficiency;
        totalCapacity += monthlyCapacity;
      }

      // Get total required load from processes in department
      const processes = await this.context.prisma.process.findMany({
        where: { departmentId },
      });

      let totalRequired = 0;
      for (const process of processes) {
        // Sum up all task assignments for this process
        const tasks = await this.context.prisma.taskAssignment.findMany({
          where: { processId: process.id },
        });

        for (const task of tasks) {
          totalRequired += task.calculatedLoad || task.plannedHours / 2 || 0;
        }
      }

      // Calculate coverage
      const coveragePercentage =
        totalRequired > 0 ? (totalCapacity / totalRequired) * 100 : 100;
      const isOverloaded = coveragePercentage < 70; // Less than 70% coverage considered overloaded

      return {
        departmentId,
        totalCapacity,
        totalRequired,
        coveragePercentage,
        isOverloaded,
        recommendation: isOverloaded
          ? "Department is overloaded. Consider hiring or redistributing work."
          : "Department capacity is sufficient.",
      };
    });
  }
}
