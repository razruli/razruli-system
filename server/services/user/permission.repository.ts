// ============================================================================
// Permission Repository
// ============================================================================
// Handles ALL database access for Permission domain
// ============================================================================

import type { Permission, Prisma } from "@/server/db/generated/prisma/client";

export class PermissionRepository {
  constructor(private prisma: any) {}

  protected readonly modelName = "permission" as const;

  // ==================== READ OPERATIONS ====================

  async findById(id: string): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { id },
    });
  }

  async findMany(ids: readonly string[]): Promise<(Permission | null)[]> {
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: [...ids] } },
    });
    return ids.map(
      (id) => permissions.find((p: Permission) => p.id === id) || null,
    );
  }

  async findAll(): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.prisma.permission.findFirst({
      where: { name },
    });
  }

  async findBySlug(slug: string): Promise<Permission | null> {
    return this.prisma.permission.findFirst({
      where: { slug },
    });
  }

  async findByResourceAction(
    resource: string,
    action: string,
  ): Promise<Permission | null> {
    return this.prisma.permission.findFirst({
      where: { resource, action },
    });
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
    const {
      offset = 0,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = options;

    const where: Prisma.PermissionWhereInput = filter;

    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.permission.count({ where }),
    ]);

    return { data, total };
  }

  async findByResource(resource: string): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { resource },
      orderBy: { action: "asc" },
    });
  }

  async findByScope(scope: "SYSTEM" | "COMPANY"): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { scope },
      orderBy: { name: "asc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    return this.prisma.permission.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.PermissionUpdateInput,
  ): Promise<Permission> {
    return this.prisma.permission.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Permission> {
    return this.prisma.permission.delete({
      where: { id },
    });
  }

  // ==================== RELATIONSHIP QUERIES ====================

  async getRoles(permissionId: string) {
    return this.prisma.rolePermission.findMany({
      where: { permissionId },
      include: { role: true },
    });
  }

  async getActors(permissionId: string) {
    return this.prisma.actorPermission.findMany({
      where: { permissionId },
      include: { actor: true },
    });
  }
}
