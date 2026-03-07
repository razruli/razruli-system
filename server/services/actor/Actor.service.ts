/**
 * ============================================================================
 * Actor Service
 * ============================================================================
 * Business logic for Actor (business user identity)
 * Manages actors, their roles, permissions, and authorization
 */

import type { Actor } from "@/server/db/generated/prisma/client";
import { BaseService, ValidationError } from "@/server/services/base";
import type { ServiceContext } from "@/server/types/context";

import { ActorRepository } from "./Actor.repository";

export class ActorService extends BaseService {
  readonly domain = "actor";
  private repository: ActorRepository;

  constructor(context: ServiceContext) {
    super(context);
    this.repository = new ActorRepository(context.prisma);
  }

  // ==================== READ OPERATIONS ====================

  async getById(id: string): Promise<Actor | null> {
    this.log("info", `Getting actor by ID`, { id });
    const cacheKey = this.cacheKey(id);
    return await this.getOrFetch(cacheKey, () => this.repository.findById(id));
  }

  async getByIdOrThrow(id: string): Promise<Actor> {
    const actor = await this.getById(id);
    return this.ensureExists(actor, "Actor", id);
  }

  async getByUserId(userId: string): Promise<Actor | null> {
    this.log("info", `Getting actor by user ID`, { userId });
    const cacheKey = this.cacheKey(`user-${userId}`);
    return await this.getOrFetch(cacheKey, () =>
      this.repository.findByUserId(userId),
    );
  }

  async getByEmail(email: string): Promise<Actor | null> {
    this.log("info", `Getting actor by email`, { email });
    const cacheKey = this.cacheKey(`email-${email}`);
    return await this.getOrFetch(cacheKey, () =>
      this.repository.findByEmail(email),
    );
  }

  async getByCompanyId(companyId: string): Promise<Actor[]> {
    this.log("info", `Getting actors for company`, { companyId });
    const cacheKey = this.listCacheKey({ companyId });
    return await this.getOrFetch(cacheKey, () =>
      this.repository.findByCompanyId(companyId),
    );
  }

  async getByDepartmentId(departmentId: string): Promise<Actor[]> {
    this.log("info", `Getting actors for department`, { departmentId });
    const cacheKey = this.listCacheKey({ departmentId });
    return await this.getOrFetch(cacheKey, () =>
      this.repository.findByDepartmentId(departmentId),
    );
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: {
    userId: string;
    name: string;
    email: string;
    companyId: string;
    departmentId?: string;
    avatar?: string;
    phone?: string;
    bio?: string;
  }): Promise<Actor> {
    this.log("info", `Creating actor`, { email: data.email });

    // Validation
    this.validate(data.userId, "User ID required");
    this.validate(data.email, "Email required");
    this.validate(data.name, "Name required");
    this.validate(data.companyId, "Company ID required");

    // Check for duplicates
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ValidationError(
        `Actor with email "${data.email}" already exists`,
      );
    }

    const actor = await this.repository.create({
      userId: data.userId,
      email: data.email,
      name: data.name,
      companyId: data.companyId,
      departmentId: data.departmentId,
      avatar: data.avatar,
      phone: data.phone,
      bio: data.bio,
      status: "ACTIVE",
    });

    this.log("info", `Actor created`, { id: actor.id, email: actor.email });
    this.invalidateAll();

    return actor;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      avatar: string;
      phone: string;
      bio: string;
      status: Actor["status"];
      departmentId: string;
    }>,
  ): Promise<Actor> {
    this.log("info", `Updating actor`, { id });

    const updated = await this.repository.update(id, {
      ...data,
      lastActivityAt: new Date(),
    });

    this.log("info", `Actor updated`, { id });
    this.invalidate(id);

    return updated;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repository.update(id, {
      lastLoginAt: new Date(),
      lastActivityAt: new Date(),
    });
    this.invalidate(id);
  }

  async updateLastActivity(id: string): Promise<void> {
    await this.repository.update(id, {
      lastActivityAt: new Date(),
    });
    this.invalidate(id);
  }

  async deactivate(id: string): Promise<Actor> {
    this.log("info", `Deactivating actor`, { id });
    const updated = await this.repository.update(id, { status: "INACTIVE" });
    this.invalidate(id);
    return updated;
  }

  async suspend(id: string, reason?: string): Promise<Actor> {
    this.log("info", `Suspending actor`, { id, reason });
    const updated = await this.repository.update(id, {
      status: "SUSPENDED",
      metadata: { suspensionReason: reason },
    });
    this.invalidate(id);
    return updated;
  }

  // ==================== ROLE MANAGEMENT ====================

  async assignRole(
    actorId: string,
    roleId: string,
    reason?: string,
  ): Promise<void> {
    await this.getByIdOrThrow(actorId);
    this.log("info", `Assigning role to actor`, { actorId, roleId });

    await this.repository.assignRole(actorId, roleId, reason);
    this.invalidate(actorId);
  }

  async removeRole(actorId: string, roleId: string): Promise<void> {
    await this.getByIdOrThrow(actorId);
    this.log("info", `Removing role from actor`, { actorId, roleId });

    await this.repository.removeRole(actorId, roleId);
    this.invalidate(actorId);
  }

  async getRoles(actorId: string) {
    this.log("info", `Getting actor roles`, { actorId });
    return await this.repository.getActorRoles(actorId);
  }

  // ==================== PERMISSION MANAGEMENT ====================

  async grantPermission(
    actorId: string,
    permissionId: string,
    reason?: string,
  ): Promise<void> {
    await this.getByIdOrThrow(actorId);
    this.log("info", `Granting permission to actor`, { actorId, permissionId });

    await this.repository.grantPermission(actorId, permissionId, reason);
    this.invalidate(actorId);
  }

  async denyPermission(
    actorId: string,
    permissionId: string,
    reason?: string,
  ): Promise<void> {
    await this.getByIdOrThrow(actorId);
    this.log("info", `Denying permission for actor`, { actorId, permissionId });

    await this.repository.denyPermission(actorId, permissionId, reason);
    this.invalidate(actorId);
  }

  async revokePermission(actorId: string, permissionId: string): Promise<void> {
    await this.getByIdOrThrow(actorId);
    this.log("info", `Revoking permission from actor`, {
      actorId,
      permissionId,
    });

    await this.repository.revokePermission(actorId, permissionId);
    this.invalidate(actorId);
  }

  async getPermissions(actorId: string) {
    this.log("info", `Getting actor permissions`, { actorId });
    return await this.repository.getActorPermissions(actorId);
  }

  // ==================== AUTHORIZATION CHECKS ====================

  /**
   * Check if actor has permission (includes role permissions)
   */
  async hasPermission(
    actorId: string,
    resource: string,
    action: string,
  ): Promise<boolean> {
    // Validate actor exists
    await this.getByIdOrThrow(actorId);

    // Get explicit actor permissions
    const actorPerms = await this.repository.getActorPermissions(actorId);

    // Check for explicit deny first
    const denied = actorPerms.find(
      (ap) =>
        !ap.grant &&
        ap.permission.resource === resource &&
        ap.permission.action === action,
    );
    if (denied) return false;

    // Check for explicit grant
    const granted = actorPerms.find(
      (ap) =>
        ap.grant &&
        ap.permission.resource === resource &&
        ap.permission.action === action,
    );
    if (granted) return true;

    // Check role permissions
    const roles = await this.repository.getActorRoles(actorId);
    for (const ar of roles) {
      const rolePerms = ar.role.permissions || [];
      const hasRolePerm = rolePerms.some(
        (rp) =>
          rp.permission.resource === resource &&
          rp.permission.action === action,
      );
      if (hasRolePerm) return true;
    }

    return false;
  }

  /**
   * Get all permissions for actor (including role permissions)
   */
  async getAllPermissions(actorId: string): Promise<Set<string>> {
    const permissions = new Set<string>();

    // Get role permissions
    const roles = await this.repository.getActorRoles(actorId);
    for (const ar of roles) {
      const rolePerms = ar.role.permissions || [];
      rolePerms.forEach((rp) => {
        permissions.add(`${rp.permission.resource}:${rp.permission.action}`);
      });
    }

    // Get actor permissions (grants override)
    const actorPerms = await this.repository.getActorPermissions(actorId);
    for (const ap of actorPerms) {
      if (ap.grant) {
        permissions.add(`${ap.permission.resource}:${ap.permission.action}`);
      } else {
        permissions.delete(`${ap.permission.resource}:${ap.permission.action}`);
      }
    }

    return permissions;
  }
}
