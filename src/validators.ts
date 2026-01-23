import type { ConstraintValidationResult, FieldConfig } from './types.js';

/**
 * Get the actual JavaScript type of a value
 */
export function getActualType(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

/**
 * Check if a value's type matches the expected type
 */
export function validateType(value: unknown, expectedType: string): boolean {
    const actualType = getActualType(value);

    if (actualType === 'undefined') return false;

    switch (expectedType) {
        case 'string':
            return actualType === 'string';
        case 'integer':
            return actualType === 'number' && Number.isInteger(value);
        case 'number':
            return actualType === 'number';
        case 'boolean':
            return actualType === 'boolean';
        case 'object':
            return actualType === 'object' && !Array.isArray(value) && value !== null;
        case 'array':
            return actualType === 'array';
        default:
            return false;
    }
}

/**
 * Validate string-specific constraints
 */
function validateStringConstraints(
    value: string,
    constraints: NonNullable<FieldConfig['constraints']>,
): ConstraintValidationResult[] {
    const results: ConstraintValidationResult[] = [];

    if (constraints.pattern !== undefined) {
        const regex = new RegExp(constraints.pattern);
        const valid = regex.test(value);
        results.push({
            constraint: `pattern: ${constraints.pattern}`,
            valid,
            reason: valid ? undefined : `Value "${value}" does not match pattern`,
        });
    }

    if (constraints.minLength !== undefined) {
        const valid = value.length >= constraints.minLength;
        results.push({
            constraint: `minLength: ${constraints.minLength}`,
            valid,
            reason: valid ? undefined : `Length ${value.length} < ${constraints.minLength}`,
        });
    }

    if (constraints.maxLength !== undefined) {
        const valid = value.length <= constraints.maxLength;
        results.push({
            constraint: `maxLength: ${constraints.maxLength}`,
            valid,
            reason: valid ? undefined : `Length ${value.length} > ${constraints.maxLength}`,
        });
    }

    return results;
}

/**
 * Validate number-specific constraints
 */
function validateNumberConstraints(
    value: number,
    constraints: NonNullable<FieldConfig['constraints']>,
): ConstraintValidationResult[] {
    const results: ConstraintValidationResult[] = [];

    if (constraints.minimum !== undefined) {
        const valid = value >= constraints.minimum;
        results.push({
            constraint: `minimum: ${constraints.minimum}`,
            valid,
            reason: valid ? undefined : `Value ${value} < ${constraints.minimum}`,
        });
    }

    if (constraints.maximum !== undefined) {
        const valid = value <= constraints.maximum;
        results.push({
            constraint: `maximum: ${constraints.maximum}`,
            valid,
            reason: valid ? undefined : `Value ${value} > ${constraints.maximum}`,
        });
    }

    return results;
}

/**
 * Validate array-specific constraints
 */
function validateArrayConstraints(
    value: unknown[],
    constraints: NonNullable<FieldConfig['constraints']>,
): ConstraintValidationResult[] {
    const results: ConstraintValidationResult[] = [];

    if (constraints.minItems !== undefined) {
        const valid = value.length >= constraints.minItems;
        results.push({
            constraint: `minItems: ${constraints.minItems}`,
            valid,
            reason: valid ? undefined : `Array length ${value.length} < ${constraints.minItems}`,
        });
    }

    if (constraints.maxItems !== undefined) {
        const valid = value.length <= constraints.maxItems;
        results.push({
            constraint: `maxItems: ${constraints.maxItems}`,
            valid,
            reason: valid ? undefined : `Array length ${value.length} > ${constraints.maxItems}`,
        });
    }

    return results;
}

/**
 * Validate object-specific constraints
 */
function validateObjectConstraints(
    value: Record<string, unknown>,
    constraints: NonNullable<FieldConfig['constraints']>,
): ConstraintValidationResult[] {
    const results: ConstraintValidationResult[] = [];
    const keys = Object.keys(value);

    if (constraints.minProperties !== undefined) {
        const valid = keys.length >= constraints.minProperties;
        results.push({
            constraint: `minProperties: ${constraints.minProperties}`,
            valid,
            reason: valid ? undefined : `Property count ${keys.length} < ${constraints.minProperties}`,
        });
    }

    if (constraints.maxProperties !== undefined) {
        const valid = keys.length <= constraints.maxProperties;
        results.push({
            constraint: `maxProperties: ${constraints.maxProperties}`,
            valid,
            reason: valid ? undefined : `Property count ${keys.length} > ${constraints.maxProperties}`,
        });
    }

    if (constraints.patternKey !== undefined) {
        const regex = new RegExp(constraints.patternKey);
        const invalidKeys = keys.filter((k) => !regex.test(k));
        const valid = invalidKeys.length === 0;
        results.push({
            constraint: `patternKey: ${constraints.patternKey}`,
            valid,
            reason: valid ? undefined : `Keys don't match pattern: ${invalidKeys.join(', ')}`,
        });
    }

    return results;
}

/**
 * Validate all constraints for a field value
 */
export function validateConstraints(
    value: unknown,
    constraints: FieldConfig['constraints'],
    fieldType: string,
): ConstraintValidationResult[] {
    if (!constraints) return [];

    if (fieldType === 'string' && typeof value === 'string') {
        return validateStringConstraints(value, constraints);
    }

    if ((fieldType === 'integer' || fieldType === 'number') && typeof value === 'number') {
        return validateNumberConstraints(value, constraints);
    }

    if (fieldType === 'array' && Array.isArray(value)) {
        return validateArrayConstraints(value, constraints);
    }

    if (fieldType === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return validateObjectConstraints(value as Record<string, unknown>, constraints);
    }

    return [];
}
