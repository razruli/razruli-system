-- Add slug column as nullable first
ALTER TABLE "company" ADD COLUMN "slug" VARCHAR(255);

-- Generate slugs for existing companies
-- Convert name to lowercase, replace spaces with hyphens, remove special chars
UPDATE "company" SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(TRIM("name"), '\s+', '-', 'g'),
      '[^a-z0-9\-]', '', 'g'
    ),
    '-+', '-', 'g'
  )
) WHERE "slug" IS NULL;

-- Handle any NULL slugs (edge case) - assign based on ID
UPDATE "company" SET "slug" = 'company-' || id WHERE "slug" IS NULL OR "slug" = '';

-- Add unique constraint and index
ALTER TABLE "company" ADD CONSTRAINT "company_slug_key" UNIQUE ("slug");
CREATE INDEX "company_slug_idx" ON "company" ("slug");
