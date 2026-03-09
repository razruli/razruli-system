// ============================================================================
// Permission Service
// ============================================================================
// Business logic for Permission domain
// Uses PermissionRepository for all DB access
// ============================================================================

import type { Permission } from "@/server/db/generated/prisma/client";
import { BaseService } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { PermissionRepository } from "./permission.repository";

export class PermissionService extends BaseService {
  readonly domain = "permission";
  private repository: PermissionRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new PermissionRepository(context.prisma);
  }

  // ==================== READ OPERATIONS ====================

  async getById(id: string): Promise<Permission | null> {
    this.log("info", `Getting permission by ID`, { id });
    const cacheKey = this.cacheKey(id);

    return await this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Permission> {
    const permission = await this.getById(id);
    return this.ensureExists(permission, "Permission", id);
  }

  async getByIds(ids: string[]): Promise<(Permission | null)[]> {
    if (ids.length === 0) return [];

    return this.repository.findMany(ids);
  }

  async getByName(name: string): Promise<Permission | null> {
    this.log("info", `Getting permission by name`, { name });

    const cacheKey = this.queryCacheKey(`name:${name}`);

    return await this.getOrFetch(cacheKey, () =>
      this.repository.findByName(name),
    );
  }

  async getBySlug(slug: string): Promise<Permission | null> {
    this.log("info", `Getting permission by slug`, { slug });

    const cacheKey = this.queryCacheKey(`slug:${slug}`);

    return await this.getOrFetch(cacheKey, () =>
      this.repository.findBySlug(slug),
    );
  }

  async getByResourceAction(
    resource: string,
    action: string,
  ): Promise<Permission | null> {
    this.log("info", `Getting permission by resource:action`, {
      resource,
      action,
    });

    const cacheKey = this.queryCacheKey(`${resource}:${action}`);

    return await this.getOrFetch(cacheKey, () =>
      this.repository.findByResourceAction(resource, action),
    );
  }

  async getAll(): Promise<Permission[]> {
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
  ): Promise<{ data: Permission[]; total: number }> {
    this.log("info", `Finding permissions`, { filter, options });

    const cacheKey = this.listCacheKey(filter);

    return this.getOrFetch(cacheKey, () =>
      this.repository.find(filter, options),
    );
  }

  async getByResource(resource: string): Promise<Permission[]> {
    this.log("info", `Getting permissions for resource`, { resource });

    const cacheKey = this.listCacheKey({ resource });

    return this.getOrFetch(cacheKey, () =>
      this.repository.findByResource(resource),
    );
  }

  async getByScope(scope: "SYSTEM" | "COMPANY"): Promise<Permission[]> {
    this.log("info", `Getting permissions by scope`, { scope });

    const cacheKey = this.listCacheKey({ scope });

    return this.getOrFetch(cacheKey, () => this.repository.findByScope(scope));
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    resource: string;
    action: string;
    scope: "SYSTEM" | "COMPANY";
  }): Promise<Permission> {
    this.log("info", `Creating permission`, {
      name: data.name,
      resource: data.resource,
      action: data.action,
    });

    this.validate(data.name, "Permission name required");
    this.validate(data.slug, "Permission slug required");
    this.validate(data.resource, "Resource required");
    this.validate(data.action, "Action required");

    // Check for duplicate name
    const existing = await this.repository.findByName(data.name);
    if (existing) {
      throw new Error(`Permission "${data.name}" already exists`);
    }

    // Check for duplicate slug
    const existingSlug = await this.repository.findBySlug(data.slug);
    if (existingSlug) {
      throw new Error(`Slug "${data.slug}" is already in use`);
    }

    // Check for duplicate resource:action
    const existingAction = await this.repository.findByResourceAction(
      data.resource,
      data.action,
    );
    if (existingAction) {
      throw new Error(
        `Permission "${data.resource}:${data.action}" already exists`,
      );
    }

    const permission = await this.repository.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      resource: data.resource,
      action: data.action,
      scope: data.scope,
    });

    this.log("info", `Permission created`, { id: permission.id });

    this.invalidateAll();

    return permission;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      resource: string;
      action: string;
    }>,
  ): Promise<Permission> {
    this.log("info", `Updating permission`, { id });

    const permission = await this.getByIdOrThrow(id);

    // Check for duplicate name if changing
    if (data.name && data.name !== permission.name) {
      const existing = await this.repository.findByName(data.name);
      if (existing) {
        throw new Error(`Permission "${data.name}" already exists`);
      }
    }

    // Check for duplicate slug if changing
    if (data.slug && data.slug !== permission.slug) {
      const existingSlug = await this.repository.findBySlug(data.slug);
      if (existingSlug) {
        throw new Error(`Slug "${data.slug}" is already in use`);
      }
    }

    const updated = await this.repository.update(id, data);

    this.invalidate(id);
    this.invalidateAll();

    return updated;
  }

  async delete(id: string): Promise<Permission> {
    this.log("info", `Deleting permission`, { id });

    const permission = await this.getByIdOrThrow(id);

    // Check if permission is used in roles
    const roles = await this.repository.getRoles(id);
    if (roles.length > 0) {
      throw new Error(
        `Permission is assigned to ${roles.length} role(s). Remove from roles first.`,
      );
    }

    // Check if permission is assigned to actors
    const actors = await this.repository.getActors(id);
    if (actors.length > 0) {
      throw new Error(
        `Permission is assigned to ${actors.length} actor(s). Remove from actors first.`,
      );
    }

    const deleted = await this.repository.delete(id);

    this.invalidate(id);
    this.invalidateAll();

    return deleted;
  }

  // ==================== RELATIONSHIP QUERIES ====================

  async getRoles(permissionId: string) {
    this.log("info", `Getting roles for permission`, { permissionId });

    await this.getByIdOrThrow(permissionId);

    return this.repository.getRoles(permissionId);
  }

  async getActors(permissionId: string) {
    this.log("info", `Getting actors with permission`, { permissionId });

    await this.getByIdOrThrow(permissionId);

    return this.repository.getActors(permissionId);
  }
}
