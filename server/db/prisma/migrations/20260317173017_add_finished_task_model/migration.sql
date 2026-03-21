-- CreateTable
CREATE TABLE "finished_task" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "employeeId" TEXT,
    "processId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "hoursSpent" DOUBLE PRECISION,
    "status" VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finished_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "finished_task_companyId_idx" ON "finished_task"("companyId");

-- CreateIndex
CREATE INDEX "finished_task_departmentId_idx" ON "finished_task"("departmentId");

-- CreateIndex
CREATE INDEX "finished_task_employeeId_idx" ON "finished_task"("employeeId");

-- CreateIndex
CREATE INDEX "finished_task_processId_idx" ON "finished_task"("processId");

-- CreateIndex
CREATE INDEX "finished_task_completedAt_idx" ON "finished_task"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "finished_task_companyId_departmentId_processId_employeeId_c_key" ON "finished_task"("companyId", "departmentId", "processId", "employeeId", "completedAt");

-- AddForeignKey
ALTER TABLE "finished_task" ADD CONSTRAINT "finished_task_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finished_task" ADD CONSTRAINT "finished_task_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finished_task" ADD CONSTRAINT "finished_task_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finished_task" ADD CONSTRAINT "finished_task_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE;
