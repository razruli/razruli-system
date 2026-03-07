/**
 * ============================================================================
 * Actor Repository
 * ============================================================================
 * Data access layer for Actor model
 * Handles all database queries for actors, roles, and permissions
 */

import type { Actor, PrismaClient } from "@/server/db/generated/prisma/client";
export class ActorRepository {
  constructor(private prisma: PrismaClient) {}

  // ==================== READ OPERATIONS ====================

  async findById(id: string): Promise<Actor | null> {
    return this.prisma.actor.findUnique({
      where: { id },
      include: {
        user: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Actor | null> {
    return this.prisma.actor.findUnique({
      where: { userId },
      include: {
        user: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Actor | null> {
    return this.prisma.actor.findUnique({
      where: { email },
      include: {
        user: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async findByCompanyId(companyId: string): Promise<Actor[]> {
    return this.prisma.actor.findMany({
      where: { companyId },
      include: {
        user: true,
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async findByDepartmentId(departmentId: string): Promise<Actor[]> {
    return this.prisma.actor.findMany({
      where: { departmentId },
      include: {
        user: true,
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async findByCompanyAndStatus(
    companyId: string,
    status: string,
  ): Promise<Actor[]> {
    return this.prisma.actor.findMany({
      where: { companyId, status: status as Actor["status"] },
      include: {
        user: true,
        roles: {
          include: { role: true },
        },
      },
    });
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
    status?: string;
    metadata?: any;
  }): Promise<Actor> {
    return this.prisma.actor.create({
      data: {
        userId: data.userId,
        name: data.name,
        email: data.email,
        companyId: data.companyId,
        departmentId: data.departmentId,
        avatar: data.avatar,
        phone: data.phone,
        bio: data.bio,
        status: data.status as Actor["status"],
        metadata: data.metadata,
      },
      include: {
        user: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      avatar: string;
      phone: string;
      bio: string;
      status: Actor["status"];
      metadata: any;
      lastLoginAt: Date;
      lastActivityAt: Date;
    }>,
  ): Promise<Actor> {
    return this.prisma.actor.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.actor.delete({
      where: { id },
    });
  }

  // ==================== ROLE OPERATIONS ====================

  async assignRole(
    actorId: string,
    roleId: string,
    reason?: string,
  ): Promise<void> {
    await this.prisma.actorRole.create({
      data: {
        actorId,
        roleId,
        reason,
      },
    });
  }

  async removeRole(actorId: string, roleId: string): Promise<void> {
    await this.prisma.actorRole.deleteMany({
      where: { actorId, roleId },
    });
  }

  async getActorRoles(actorId: string) {
    return this.prisma.actorRole.findMany({
      where: { actorId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });
  }

  // ==================== PERMISSION OPERATIONS ====================

  async grantPermission(
    actorId: string,
    permissionId: string,
    reason?: string,
  ): Promise<void> {
    await this.prisma.actorPermission.upsert({
      where: { actorId_permissionId: { actorId, permissionId } },
      update: { grant: true },
      create: {
        actorId,
        permissionId,
        grant: true,
        reason,
      },
    });
  }

  async denyPermission(
    actorId: string,
    permissionId: string,
    reason?: string,
  ): Promise<void> {
    await this.prisma.actorPermission.upsert({
      where: { actorId_permissionId: { actorId, permissionId } },
      update: { grant: false },
      create: {
        actorId,
        permissionId,
        grant: false,
        reason,
      },
    });
  }

  async revokePermission(actorId: string, permissionId: string): Promise<void> {
    await this.prisma.actorPermission.deleteMany({
      where: { actorId, permissionId },
    });
  }

  async getActorPermissions(actorId: string) {
    return this.prisma.actorPermission.findMany({
      where: { actorId },
      include: { permission: true },
    });
  }
}
