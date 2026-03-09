// ============================================================================
// Role Service
// ============================================================================
// Business logic for Role domain
// Uses RoleRepository for all DB access
// ============================================================================

import type { Role } from "@/server/db/generated/prisma/client";
import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { RoleRepository } from "./role.repository";

export class RoleService extends BaseService {
  readonly domain = "role";
  private repository: RoleRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new RoleRepository(context.prisma);
  }

  // ==================== READ OPERATIONS ====================

  async getById(id: string): Promise<Role | null> {
    this.log("info", `Getting role by ID`, { id });
    const cacheKey = this.cacheKey(id);

    return await this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Role> {
    const role = await this.getById(id);
    return this.ensureExists(role, "Role", id);
  }

  async getByIds(ids: string[]): Promise<(Role | null)[]> {
    if (ids.length === 0) return [];

    return this.repository.findMany(ids);
  }

  async getByName(name: string, companyId?: string): Promise<Role | null> {
    this.log("info", `Getting role by name`, { name, companyId });

    const cacheKey = this.queryCacheKey(
      `name:${name}:${companyId || "system"}`,
    );

    return await this.getOrFetch(cacheKey, () =>
      this.repository.findByName(name, companyId),
    );
  }

  async getBySlug(slug: string, companyId?: string): Promise<Role | null> {
    this.log("info", `Getting role by slug`, { slug, companyId });

    const cacheKey = this.queryCacheKey(
      `slug:${slug}:${companyId || "system"}`,
    );

    return await this.getOrFetch(cacheKey, () =>
      this.repository.findBySlug(slug, companyId),
    );
  }

  async getAll(): Promise<Role[]> {
    const cacheKey = this.listCacheKey({});

    return this.getOrFetch(cacheKey, () => this.repository.findAll());
  }

  async find(
    filter: Record<string, any>,
    options: {
      offset?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ): Promise<{ data: Role[]; total: number }> {
    this.log("info", `Finding roles`, { filter, options });

    const cacheKey = this.listCacheKey(filter);

    return this.getOrFetch(cacheKey, () =>
      this.repository.find(filter, options),
    );
  }

  async getByScope(scope: "SYSTEM" | "COMPANY"): Promise<Role[]> {
    this.log("info", `Getting roles by scope`, { scope });

    const cacheKey = this.listCacheKey({ scope });

    return this.getOrFetch(cacheKey, () => this.repository.findByScope(scope));
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    scope: "SYSTEM" | "COMPANY";
    companyId?: string;
  }): Promise<Role> {
    this.log("info", `Creating role`, { name: data.name, scope: data.scope });

    this.validate(data.name, "Role name required");
    this.validate(data.slug, "Role slug required");
    this.validateCondition(
      data.scope === "SYSTEM" || data.scope === "COMPANY",
      "Invalid scope",
    );

    // Check for duplicate name
    const existing = await this.repository.findByName(
      data.name,
      data.companyId,
    );
    if (existing) {
      throw new Error(
        `Role "${data.name}" already exists${data.companyId ? " for this company" : ""}`,
      );
    }

    // Check for duplicate slug
    const existingSlug = await this.repository.findBySlug(
      data.slug,
      data.companyId,
    );
    if (existingSlug) {
      throw new Error(`Slug "${data.slug}" is already in use`);
    }

    const role = await this.repository.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      scope: data.scope,
      company: data.companyId ? { connect: { id: data.companyId } } : undefined,
    });

    this.log("info", `Role created`, { id: role.id });

    this.invalidateAll();

    return role;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
    }>,
  ): Promise<Role> {
    this.log("info", `Updating role`, { id });

    const role = await this.getByIdOrThrow(id);

    // Check for duplicate name if changing
    if (data.name && data.name !== role.name) {
      const existing = await this.repository.findByName(
        data.name,
        role.companyId || undefined,
      );
      if (existing) {
        throw new Error(
          `Role "${data.name}" already exists${role.companyId ? " for this company" : ""}`,
        );
      }
    }

    // Check for duplicate slug if changing
    if (data.slug && data.slug !== role.slug) {
      const existingSlug = await this.repository.findBySlug(
        data.slug,
        role.companyId || undefined,
      );
      if (existingSlug) {
        throw new Error(`Slug "${data.slug}" is already in use`);
      }
    }

    const updated = await this.repository.update(id, data);

    this.invalidate(id);
    this.invalidateAll();

    return updated;
  }

  async delete(id: string): Promise<Role> {
    this.log("info", `Deleting role`, { id });

    const role = await this.getByIdOrThrow(id);

    // Prevent deletion of system roles with actors
    if (role.scope === "SYSTEM") {
      const actors = await this.repository.getActors(id);
      if (actors.length > 0) {
        throw new Error(
          "Cannot delete system role with assigned actors. Unassign all actors first.",
        );
      }
    }

    const deleted = await this.repository.delete(id);

    this.invalidate(id);
    this.invalidateAll();

    return deleted;
  }

  // ==================== PERMISSION MANAGEMENT ====================

  async addPermission(roleId: string, permissionId: string) {
    this.log("info", `Adding permission to role`, { roleId, permissionId });

    await this.getByIdOrThrow(roleId);

    const result = await this.repository.addPermission(roleId, permissionId);

    this.invalidate(roleId);

    return result;
  }

  async removePermission(roleId: string, permissionId: string) {
    this.log("info", `Removing permission from role`, { roleId, permissionId });

    await this.getByIdOrThrow(roleId);

    await this.repository.removePermission(roleId, permissionId);

    this.invalidate(roleId);
  }

  async getPermissions(roleId: string) {
    this.log("info", `Getting permissions for role`, { roleId });

    await this.getByIdOrThrow(roleId);

    return this.repository.getPermissions(roleId);
  }
}
