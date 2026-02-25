-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'UTC+3',
    "workingHoursDay" INTEGER NOT NULL DEFAULT 8,
    "workingDaysPerMonth" INTEGER NOT NULL DEFAULT 21,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "headId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "kGrade" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "fio" VARCHAR(255) NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "birthDate" TIMESTAMP(3),
    "hireDate" TIMESTAMP(3) NOT NULL,
    "fireDate" TIMESTAMP(3),
    "kEfficiency" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "workingHoursPerDay" INTEGER NOT NULL DEFAULT 8,
    "employmentType" VARCHAR(50) NOT NULL DEFAULT 'ТД',
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "plannedHours" INTEGER NOT NULL,
    "kBurn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "kCrit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "kNew" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "targetGradeId" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'open',
    "priority" VARCHAR(50) NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_assignment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "plannedHours" DOUBLE PRECISION NOT NULL,
    "actualHours" DOUBLE PRECISION,
    "calculatedLoad" DOUBLE PRECISION,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "load_snapshot" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT,
    "departmentId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "loadIndex" DOUBLE PRECISION NOT NULL,
    "totalLoadCU" DOUBLE PRECISION NOT NULL,
    "totalCapacityCU" DOUBLE PRECISION NOT NULL,
    "percentUsed" DOUBLE PRECISION NOT NULL,
    "employeeStatus" VARCHAR(50),
    "workingDays" INTEGER,
    "activeEmployeeCount" INTEGER,
    "overloadedCount" INTEGER,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "load_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gap_analysis_result" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "analysisType" VARCHAR(100) NOT NULL,
    "currentLoadIndex" DOUBLE PRECISION NOT NULL,
    "requiredLoadIndex" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "deficitCU" DOUBLE PRECISION NOT NULL,
    "recommendedGrade" VARCHAR(100) NOT NULL,
    "recommendedCount" INTEGER NOT NULL,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gap_analysis_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hiring_request" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "departmentId" TEXT,
    "position" VARCHAR(255) NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "candidatesNeeded" INTEGER NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "experienceJustification" TEXT,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "interviewStages" INTEGER NOT NULL DEFAULT 2,
    "trialPeriodMonths" INTEGER NOT NULL DEFAULT 3,
    "kpiTrial" TEXT,
    "kpiPermanent" TEXT,
    "trigger" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hiring_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_history" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "fieldName" VARCHAR(100) NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedBy" VARCHAR(255) NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "employee_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "changedBy" VARCHAR(255) NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "department_headId_key" ON "department"("headId");

-- CreateIndex
CREATE INDEX "department_companyId_idx" ON "department"("companyId");

-- CreateIndex
CREATE INDEX "department_headId_idx" ON "department"("headId");

-- CreateIndex
CREATE UNIQUE INDEX "department_companyId_name_key" ON "department"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "grade_name_key" ON "grade"("name");

-- CreateIndex
CREATE INDEX "employee_companyId_idx" ON "employee"("companyId");

-- CreateIndex
CREATE INDEX "employee_departmentId_idx" ON "employee"("departmentId");

-- CreateIndex
CREATE INDEX "employee_gradeId_idx" ON "employee"("gradeId");

-- CreateIndex
CREATE INDEX "employee_status_idx" ON "employee"("status");

-- CreateIndex
CREATE UNIQUE INDEX "employee_companyId_fio_key" ON "employee"("companyId", "fio");

-- CreateIndex
CREATE INDEX "process_companyId_idx" ON "process"("companyId");

-- CreateIndex
CREATE INDEX "process_departmentId_idx" ON "process"("departmentId");

-- CreateIndex
CREATE INDEX "process_targetGradeId_idx" ON "process"("targetGradeId");

-- CreateIndex
CREATE INDEX "process_status_idx" ON "process"("status");

-- CreateIndex
CREATE INDEX "task_assignment_companyId_idx" ON "task_assignment"("companyId");

-- CreateIndex
CREATE INDEX "task_assignment_employeeId_idx" ON "task_assignment"("employeeId");

-- CreateIndex
CREATE INDEX "task_assignment_processId_idx" ON "task_assignment"("processId");

-- CreateIndex
CREATE INDEX "task_assignment_status_idx" ON "task_assignment"("status");

-- CreateIndex
CREATE INDEX "task_assignment_createdAt_idx" ON "task_assignment"("createdAt");

-- CreateIndex
CREATE INDEX "load_snapshot_companyId_idx" ON "load_snapshot"("companyId");

-- CreateIndex
CREATE INDEX "load_snapshot_employeeId_idx" ON "load_snapshot"("employeeId");

-- CreateIndex
CREATE INDEX "load_snapshot_departmentId_idx" ON "load_snapshot"("departmentId");

-- CreateIndex
CREATE INDEX "load_snapshot_periodStart_periodEnd_idx" ON "load_snapshot"("periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "load_snapshot_companyId_employeeId_periodStart_periodEnd_key" ON "load_snapshot"("companyId", "employeeId", "periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "load_snapshot_companyId_departmentId_periodStart_periodEnd_key" ON "load_snapshot"("companyId", "departmentId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "gap_analysis_result_companyId_idx" ON "gap_analysis_result"("companyId");

-- CreateIndex
CREATE INDEX "gap_analysis_result_departmentId_idx" ON "gap_analysis_result"("departmentId");

-- CreateIndex
CREATE INDEX "gap_analysis_result_createdAt_idx" ON "gap_analysis_result"("createdAt");

-- CreateIndex
CREATE INDEX "hiring_request_companyId_idx" ON "hiring_request"("companyId");

-- CreateIndex
CREATE INDEX "hiring_request_departmentId_idx" ON "hiring_request"("departmentId");

-- CreateIndex
CREATE INDEX "hiring_request_status_idx" ON "hiring_request"("status");

-- CreateIndex
CREATE INDEX "employee_history_employeeId_idx" ON "employee_history"("employeeId");

-- CreateIndex
CREATE INDEX "employee_history_changedAt_idx" ON "employee_history"("changedAt");

-- CreateIndex
CREATE INDEX "employee_history_fieldName_idx" ON "employee_history"("fieldName");

-- CreateIndex
CREATE INDEX "audit_log_companyId_idx" ON "audit_log"("companyId");

-- CreateIndex
CREATE INDEX "audit_log_entityType_entityId_idx" ON "audit_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");

-- CreateIndex
CREATE INDEX "audit_log_changedAt_idx" ON "audit_log"("changedAt");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_headId_fkey" FOREIGN KEY ("headId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process" ADD CONSTRAINT "process_targetGradeId_fkey" FOREIGN KEY ("targetGradeId") REFERENCES "grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "load_snapshot" ADD CONSTRAINT "load_snapshot_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "load_snapshot" ADD CONSTRAINT "load_snapshot_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "load_snapshot" ADD CONSTRAINT "load_snapshot_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_history" ADD CONSTRAINT "employee_history_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
