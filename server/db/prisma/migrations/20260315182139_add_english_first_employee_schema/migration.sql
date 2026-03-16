/*
  Warnings:

  - You are about to drop the column `fio` on the `employee` table. All the data in the column will be lost.
  - Changed the type of `gender` on the `employee` table. No cast exists, so the migration will fail if there is data, with the exception of the default value.
  - Changed the type of `employmentType` on the `employee` table. No cast exists, so the migration will fail if there is data, with the exception of the default value.
  - Changed the type of `status` on the `employee` table. No cast exists, so the migration will fail if there is data, with the exception of the default value.
  - Added the required column `firstName` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
/*
  Warnings:

  - Changed the type of `gender` on the `employee` table. No cast exists, so the migration will fail if there is data, with the exception of the default value.
  - Changed the type of `employmentType` on the `employee` table. No cast exists, so the migration will fail if there is data, with the exception of the default value.
  - Changed the type of `status` on the `employee` table. No cast exists, so the migration will fail if there is data, with the exception of the default value.
  - Added the required column `firstName` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `employee` table without a default value. This is not possible if the table is not empty.

*/

-- Delete all employee records to avoid conflicts
DELETE FROM "employee";

-- Drop existing unique constraint if it exists
ALTER TABLE "employee" DROP CONSTRAINT IF EXISTS "employee_companyId_fio_key";

-- Drop the fio column if it exists
ALTER TABLE "employee" DROP COLUMN IF EXISTS "fio";

-- Check if enums already exist and create if needed
-- Note: We'll drop and recreate the columns regardless
ALTER TABLE "employee" 
  DROP COLUMN IF EXISTS "gender",
  DROP COLUMN IF EXISTS "employmentType",
  DROP COLUMN IF EXISTS "status",
  DROP COLUMN IF EXISTS "firstName",
  DROP COLUMN IF EXISTS "lastName";

-- Drop old enum types if they exist (safe since columns are already dropped)
DROP TYPE IF EXISTS "EmploymentType" CASCADE;
DROP TYPE IF EXISTS "Gender" CASCADE;
DROP TYPE IF EXISTS "EmployeeStatus" CASCADE;

-- Create new enums
CREATE TYPE "EmploymentType" AS ENUM ('LABOR_CONTRACT', 'SERVICE_CONTRACT', 'SELF_EMPLOYED');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- Add columns back with new enum types
ALTER TABLE "employee" 
  ADD COLUMN "gender" "Gender" NOT NULL DEFAULT 'OTHER'::"Gender",
  ADD COLUMN "employmentType" "EmploymentType" NOT NULL DEFAULT 'LABOR_CONTRACT'::"EmploymentType",
  ADD COLUMN "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE'::"EmployeeStatus",
  ADD COLUMN "firstName" VARCHAR(255) NOT NULL DEFAULT 'Unknown',
  ADD COLUMN "lastName" VARCHAR(255) NOT NULL DEFAULT 'Unknown';

-- Drop the defaults for firstName/lastName (they should not have defaults for new inserts)
ALTER TABLE "employee" 
  ALTER COLUMN "firstName" DROP DEFAULT,
  ALTER COLUMN "lastName" DROP DEFAULT;

-- Add new unique constraint
ALTER TABLE "employee" ADD CONSTRAINT "employee_companyId_firstName_lastName_key" UNIQUE("companyId", "firstName", "lastName");
