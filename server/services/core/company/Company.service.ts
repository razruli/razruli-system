// ============================================================================
// Company Service
// ============================================================================
// Business logic for Company domain
// Uses CompanyRepository for all DB access
// ============================================================================

import type { Company } from "@/server/db/generated/prisma/client";
import { BaseService, ValidationError } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { CompanyRepository } from "./Company.repository";

export class CompanyService extends BaseService {
  readonly domain = "company";
  private repository: CompanyRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new CompanyRepository(context.prisma);
  }

  // ==================== READ OPERATIONS ====================

  async getById(id: string): Promise<Company | null> {
    this.log("info", `Getting company by ID`, { id });
    const cacheKey = this.cacheKey(id);

    return await this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Company> {
    const company = await this.getById(id);
    return this.ensureExists(company, "Company", id);
  }

  async getAll(): Promise<Company[]> {
    const cacheKey = this.listCacheKey({});

    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  async find(
    filters?: {
      search?: string;
    },
    pagination?: {
      offset?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "ASC" | "DESC";
    },
  ): Promise<{
    data: Company[];
    total: number;
    hasMore: boolean;
  }> {
    this.log("info", `Finding companies with filters`, { filters, pagination });

    const offset = pagination?.offset || 0;
    const limit = pagination?.limit || 20;

    let data = await this.repository.findAll();

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter((c) => c.name.toLowerCase().includes(searchLower));
    }

    const total = data.length;
    const paginatedData = data.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      data: paginatedData,
      total,
      hasMore,
    };
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    name: string;
    timezone?: string;
    workingHoursDay?: number;
    workingDaysPerMonth?: number;
  }): Promise<Company> {
    this.log("info", `Creating company`, { name: data.name });

    this.validate(data.name, "Company name required");

    // Check for duplicate name
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new ValidationError(`Company "${data.name}" already exists`);
    }

    const company = await this.repository.create({
      name: data.name,
      timezone: data.timezone,
      workingHoursDay: data.workingHoursDay,
      workingDaysPerMonth: data.workingDaysPerMonth,
    });

    this.log("info", `Company created`, { id: company.id });

    // Invalidate list cache
    this.invalidateAll();

    return company;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
    }>,
  ): Promise<Company> {
    this.log("info", `Updating company`, { id });

    await this.getByIdOrThrow(id);

    const updated = await this.repository.update(id, data);

    this.invalidate(id);
    this.invalidateAll();

    return updated;
  }

  // ==================== BUSINESS LOGIC ====================

  async getWithStats(id: string) {
    const company = await this.getByIdOrThrow(id);

    const [departmentCount, employeeCount] = await Promise.all([
      this.repository.getDepartmentCount(id),
      this.repository.getEmployeeCount(id),
    ]);

    return {
      ...company,
      stats: {
        departments: departmentCount,
        employees: employeeCount,
      },
    };
  }
}
