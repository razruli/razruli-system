/**
 * Server-side CSV parser for Node.js
 * Parses CSV Buffer/string into structured data
 */

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
}

/**
 * Parse CSV content from Buffer (file upload)
 */
export function parseCSVBuffer(buffer: Buffer): ParsedCSV {
  const content = buffer.toString("utf-8");
  return parseCSVContent(content);
}

/**
 * Parse CSV content string into structured data
 */
export function parseCSVContent(content: string): ParsedCSV {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);

  if (headers.length === 0) {
    throw new Error("No columns found in CSV header");
  }

  // Parse data rows
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length > 0 && values.some((v) => v.length > 0)) {
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || "";
      });
      rows.push(row);
    }
  }

  return { headers, rows };
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  fields.push(current.trim());

  return fields;
}

/**
 * Validate parsed CSV structure
 */
export function validateParsedCSV(
  parsed: ParsedCSV,
  minColumns: number = 1,
): void {
  if (parsed.headers.length < minColumns) {
    throw new Error(
      `CSV must have at least ${minColumns} columns, found ${parsed.headers.length}`,
    );
  }

  if (parsed.rows.length === 0) {
    throw new Error("CSV must contain at least one data row");
  }
}
