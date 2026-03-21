/**
 * Slug generation utilities
 * Creates URL-friendly slugs from company names
 */

/**
 * Generate a slug from a company name
 * Converts to lowercase, removes special chars, replaces spaces with hyphens
 *
 * Examples:
 * "Acme Corp" → "acme-corp"
 * "Tech & Innovation Inc." → "tech-innovation-inc"
 * "StratOps 2026!" → "stratops-2026"
 */
export function generateSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Remove any character that's not alphanumeric or hyphen
      .replace(/[^a-z0-9-]/g, "")
      // Replace multiple consecutive hyphens with single hyphen
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Generate a unique slug by appending a counter if needed
 * Used when a slug already exists in the database
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: Set<string>,
): string {
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.has(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}
