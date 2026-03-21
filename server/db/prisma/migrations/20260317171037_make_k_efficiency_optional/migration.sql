-- AlterEnum
ALTER TYPE "RoleScope" ADD VALUE 'GUEST';

-- DropIndex
DROP INDEX "employee_monthlyCU_idx";

-- DropIndex
DROP INDEX "process_businessImpact_idx";

-- DropIndex
DROP INDEX "process_complexity_idx";

-- DropIndex
DROP INDEX "process_newness_idx";

-- DropIndex
DROP INDEX "process_weight_idx";

-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "kEfficiency" DROP NOT NULL,
ALTER COLUMN "kEfficiency" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "employee_status_idx" ON "employee"("status");
