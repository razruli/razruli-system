/**
 * Client-side CSV parser using native JavaScript
 * Parses CSV content into headers and data rows
 */

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
}

/**
 * Parse CSV content string into structured data
 */
function parseCSVContent(content: string): ParsedCSV {
  const lines = content.split("\n").filter((line) => line.trim());

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
    if (values.length > 0) {
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
 * Handles:
 * - Quoted fields containing commas or newlines
 * - Escaped quotes inside quoted fields
 * - Unquoted fields
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
 * Read CSV file and parse it
 */
export async function readAndParseCSV(file: File): Promise<ParsedCSV> {
  const content = await file.text();
  return parseCSVContent(content);
}

/**
 * Get first N rows from parsed CSV for preview
 */
export function getCSVPreview(
  parsed: ParsedCSV,
  rowCount: number = 5,
): Record<string, string>[] {
  return parsed.rows.slice(0, rowCount);
}
