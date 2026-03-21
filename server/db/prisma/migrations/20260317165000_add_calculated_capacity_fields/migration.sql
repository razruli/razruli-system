-- Add calculated capacity fields
ALTER TABLE "employee" ADD COLUMN "monthlyCU" DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE "process" ADD COLUMN "weight" DOUBLE PRECISION;

-- Create indexes for performance
CREATE INDEX "employee_monthlyCU_idx" ON "employee"("monthlyCU");
CREATE INDEX "process_weight_idx" ON "process"("weight");
