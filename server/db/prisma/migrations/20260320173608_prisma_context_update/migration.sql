/*
  Warnings:

  - Made the column `slug` on table `company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "company" ALTER COLUMN "slug" SET NOT NULL;
