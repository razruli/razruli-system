import type {
  MiddlewareContext,
  MiddlewareOptions,
  ValidationResult,
} from "./types";

/**
 * Validation Middleware
 * Validates input arguments against custom validation functions
 *
 * Throws:
 * - VALIDATION_ERROR: When input validation fails
 */
export async function validationMiddleware(
  options: MiddlewareOptions,
  middlewareContext: MiddlewareContext,
): Promise<void> {
  // Skip if no custom validation function provided
  if (!options.validate) {
    return;
  }

  try {
    // Execute validation function
    const isValid = await Promise.resolve(
      options.validate(middlewareContext.args),
    );

    // Throw error if validation failed
    if (!isValid) {
      const message =
        options.validationMessage ||
        "VALIDATION_ERROR: Input validation failed";
      throw new Error(message);
    }
  } catch (error) {
    // Re-throw validation errors
    if (error instanceof Error) {
      if (error.message.startsWith("VALIDATION_ERROR")) {
        throw error;
      }
      throw new Error(`VALIDATION_ERROR: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Validate input arguments with multiple checks
 * Returns detailed validation result with error messages
 */
export function validateInput(
  args: any,
  validators: {
    field: string;
    check: (value: any) => boolean;
    message: string;
  }[],
): ValidationResult {
  const errors: string[] = [];

  for (const validator of validators) {
    if (!validator.check(args[validator.field])) {
      errors.push(validator.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  args: any,
  requiredFields: string[],
): ValidationResult {
  const errors: string[] = [];

  for (const field of requiredFields) {
    const value = args[field];
    if (value === null || value === undefined || value === "") {
      errors.push(`Field "${field}" is required`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate field types
 */
export function validateFieldTypes(
  args: any,
  typeMap: {
    field: string;
    expectedType: string;
  }[],
): ValidationResult {
  const errors: string[] = [];

  for (const { field, expectedType } of typeMap) {
    const value = args[field];
    const actualType = typeof value;

    if (actualType !== expectedType) {
      errors.push(
        `Field "${field}" should be ${expectedType}, got ${actualType}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  minLength?: number,
  maxLength?: number,
): ValidationResult {
  const errors: string[] = [];

  if (minLength !== undefined && value.length < minLength) {
    errors.push(`String must be at least ${minLength} characters long`);
  }

  if (maxLength !== undefined && value.length > maxLength) {
    errors.push(`String must not exceed ${maxLength} characters`);
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  min?: number,
  max?: number,
): ValidationResult {
  const errors: string[] = [];

  if (min !== undefined && value < min) {
    errors.push(`Value must be at least ${min}`);
  }

  if (max !== undefined && value > max) {
    errors.push(`Value must not exceed ${max}`);
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(
  ...results: ValidationResult[]
): ValidationResult {
  const allErrors = results.flatMap((r) => r.errors || []);

  return {
    valid: allErrors.length === 0,
    errors: allErrors.length > 0 ? allErrors : undefined,
  };
}
