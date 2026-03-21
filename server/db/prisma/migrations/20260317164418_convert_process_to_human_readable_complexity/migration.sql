-- AlterTable: Convert Process table from k-factors to human-readable complexity
ALTER TABLE "process" DROP COLUMN "kBurn",
DROP COLUMN "kCrit",
DROP COLUMN "kNew",
DROP COLUMN IF EXISTS "priority";

ALTER TABLE "process" ADD COLUMN "complexity" VARCHAR(50) NOT NULL DEFAULT 'standard',
ADD COLUMN "businessImpact" VARCHAR(50) NOT NULL DEFAULT 'medium',
ADD COLUMN "newness" VARCHAR(50) NOT NULL DEFAULT 'routine',
ADD COLUMN "isBurningOut" BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for new columns
CREATE INDEX "process_complexity_idx" ON "process"("complexity");
CREATE INDEX "process_businessImpact_idx" ON "process"("businessImpact");
CREATE INDEX "process_newness_idx" ON "process"("newness");
