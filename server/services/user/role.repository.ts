// ============================================================================
// Role Repository
// ============================================================================
// Handles ALL database access for Role domain
// ============================================================================

import type { Role, Prisma } from "@/server/db/generated/prisma/client";

export class RoleRepository {
  constructor(private prisma: any) {}

  protected readonly modelName = "role" as const;

  // ==================== READ OPERATIONS ====================

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true, company: true },
    });
  }

  async findMany(ids: readonly string[]): Promise<(Role | null)[]> {
    const roles = await this.prisma.role.findMany({
      where: { id: { in: [...ids] } },
      include: { permissions: true, company: true },
    });
    return ids.map((id) => roles.find((r: Role) => r.id === id) || null);
  }

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany({
      include: { permissions: true, company: true },
      orderBy: { name: "asc" },
    });
  }

  async findByName(name: string, companyId?: string): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: {
        name,
        ...(companyId ? { companyId } : {}),
      },
      include: { permissions: true, company: true },
    });
  }

  async findBySlug(slug: string, companyId?: string): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: {
        slug,
        ...(companyId ? { companyId } : {}),
      },
      include: { permissions: true, company: true },
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
  ): Promise<{ data: Role[]; total: number }> {
    const {
      offset = 0,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = options;

    const where: Prisma.RoleWhereInput = filter;

    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { permissions: true, company: true },
      }),
      this.prisma.role.count({ where }),
    ]);

    return { data, total };
  }

  async findByScope(scope: "SYSTEM" | "COMPANY"): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: { scope },
      include: { permissions: true, company: true },
      orderBy: { name: "asc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data,
      include: { permissions: true, company: true },
    });
  }

  async update(id: string, data: Prisma.RoleUpdateInput): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data,
      include: { permissions: true, company: true },
    });
  }

  async delete(id: string): Promise<Role> {
    return this.prisma.role.delete({
      where: { id },
      include: { permissions: true, company: true },
    });
  }

  // ==================== RELATIONSHIP QUERIES ====================

  async getPermissions(roleId: string) {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }

  async addPermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
      include: { permission: true },
    });
  }

  async removePermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.deleteMany({
      where: { roleId, permissionId },
    });
  }

  async getActors(roleId: string) {
    return this.prisma.actorRole.findMany({
      where: { roleId },
      include: { actor: true },
    });
  }
}
