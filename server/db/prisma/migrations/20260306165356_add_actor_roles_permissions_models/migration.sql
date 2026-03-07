/*
  Warnings:

  - You are about to drop the column `changedBy` on the `audit_log` table. All the data in the column will be lost.
  - You are about to drop the column `changedBy` on the `employee_history` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `audit_log` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_ACTIVATION', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('SYSTEM', 'COMPANY');

-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('SYSTEM', 'COMPANY');

-- AlterTable
ALTER TABLE "audit_log" DROP COLUMN "changedBy",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "employee_history" DROP COLUMN "changedBy",
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "changedById" TEXT;

-- CreateTable
CREATE TABLE "actor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT,
    "status" "ActorStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "lastLoginAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "scope" "RoleScope" NOT NULL DEFAULT 'SYSTEM',
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "scope" "PermissionScope" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_role" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "assignedBy" TEXT,
    "reason" TEXT,

    CONSTRAINT "actor_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_permission" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grant" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "actor_permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "actor_userId_key" ON "actor"("userId");

-- CreateIndex
CREATE INDEX "actor_userId_idx" ON "actor"("userId");

-- CreateIndex
CREATE INDEX "actor_companyId_idx" ON "actor"("companyId");

-- CreateIndex
CREATE INDEX "actor_departmentId_idx" ON "actor"("departmentId");

-- CreateIndex
CREATE INDEX "actor_status_idx" ON "actor"("status");

-- CreateIndex
CREATE UNIQUE INDEX "actor_email_key" ON "actor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_slug_key" ON "role"("slug");

-- CreateIndex
CREATE INDEX "role_scope_idx" ON "role"("scope");

-- CreateIndex
CREATE INDEX "role_companyId_idx" ON "role"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_companyId_key" ON "role"("name", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_slug_key" ON "permission"("slug");

-- CreateIndex
CREATE INDEX "permission_scope_idx" ON "permission"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "permission_resource_action_key" ON "permission"("resource", "action");

-- CreateIndex
CREATE INDEX "actor_role_actorId_idx" ON "actor_role"("actorId");

-- CreateIndex
CREATE INDEX "actor_role_roleId_idx" ON "actor_role"("roleId");

-- CreateIndex
CREATE INDEX "actor_role_expiresAt_idx" ON "actor_role"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "actor_role_actorId_roleId_key" ON "actor_role"("actorId", "roleId");

-- CreateIndex
CREATE INDEX "role_permission_roleId_idx" ON "role_permission"("roleId");

-- CreateIndex
CREATE INDEX "role_permission_permissionId_idx" ON "role_permission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_roleId_permissionId_key" ON "role_permission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "actor_permission_actorId_idx" ON "actor_permission"("actorId");

-- CreateIndex
CREATE INDEX "actor_permission_permissionId_idx" ON "actor_permission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "actor_permission_actorId_permissionId_key" ON "actor_permission"("actorId", "permissionId");

-- CreateIndex
CREATE INDEX "audit_log_createdById_idx" ON "audit_log"("createdById");

-- CreateIndex
CREATE INDEX "employee_history_changedById_idx" ON "employee_history"("changedById");

-- CreateIndex
CREATE INDEX "employee_history_approvedById_idx" ON "employee_history"("approvedById");

-- AddForeignKey
ALTER TABLE "employee_history" ADD CONSTRAINT "employee_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "actor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_history" ADD CONSTRAINT "employee_history_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "actor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "actor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor" ADD CONSTRAINT "actor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor" ADD CONSTRAINT "actor_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor" ADD CONSTRAINT "actor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_role" ADD CONSTRAINT "actor_role_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_role" ADD CONSTRAINT "actor_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_permission" ADD CONSTRAINT "actor_permission_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_permission" ADD CONSTRAINT "actor_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
