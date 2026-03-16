/**
 * Column mapper utility
 * Maps CSV columns to database fields using user-provided mappings
 */

export type ColumnMapping = Record<string, string>; // { csvColumn: dbField }

/**
 * Map a single row from CSV columns to database fields
 */
export function mapRowData(
  csvRow: Record<string, string>,
  columnMapping: ColumnMapping,
): Record<string, any> {
  const mappedRow: Record<string, any> = {};

  Object.entries(columnMapping).forEach(([csvColumn, dbField]) => {
    const value = csvRow[csvColumn];
    if (value !== undefined && value !== null) {
      mappedRow[dbField] = value;
    }
  });

  return mappedRow;
}

/**
 * Map all rows in a dataset
 */
export function mapAllRows(
  csvRows: Record<string, string>[],
  columnMapping: ColumnMapping,
): Record<string, any>[] {
  return csvRows.map((row) => mapRowData(row, columnMapping));
}

/**
 * Validate that all required fields are mapped
 */
export function validateColumnMapping(
  mapping: ColumnMapping,
  requiredFields: string[],
): { valid: boolean; missingFields: string[] } {
  const mappedDbFields = Object.values(mapping);
  const missingFields = requiredFields.filter(
    (field) => !mappedDbFields.includes(field),
  );

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
