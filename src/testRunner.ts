import type { FieldConfig, TestResult, TestSummary } from './types.js';
import { getActualType, validateConstraints, validateType } from './validators.js';

/**
 * Test a single field against its configuration
 */
export function testField(key: string, config: FieldConfig, input: Record<string, unknown>): TestResult {
    const value = input[key];
    const actualType = getActualType(value);

    // Check if field is missing
    if (value === undefined) {
        if (config.required) {
            return {
                fieldKey: key,
                fieldType: config.type,
                editor: config.editor,
                status: 'failed',
                receivedType: 'undefined',
                expectedType: config.type,
                reason: 'Required field is missing',
            };
        }
        return {
            fieldKey: key,
            fieldType: config.type,
            editor: config.editor,
            status: 'skipped',
            receivedType: 'undefined',
            expectedType: config.type,
            reason: 'Field not provided (optional)',
        };
    }

    // Check if value is null (for nullable fields)
    if (value === null) {
        return {
            fieldKey: key,
            fieldType: config.type,
            editor: config.editor,
            status: 'passed',
            receivedValue: null,
            receivedType: 'null',
            expectedType: config.type,
            reason: 'Nullable field received null',
        };
    }

    // Validate type
    const typeValid = validateType(value, config.type);

    // Validate constraints
    const constraintResults = validateConstraints(value, config.constraints, config.type);
    const allConstraintsValid = constraintResults.every((r) => r.valid);

    // Determine overall status
    let status: 'passed' | 'failed';
    let reason: string | undefined;

    if (!typeValid) {
        status = 'failed';
        reason = `Type mismatch: expected ${config.type}, got ${actualType}`;
    } else if (!allConstraintsValid) {
        status = 'failed';
        const failedConstraints = constraintResults.filter((r) => !r.valid);
        reason = failedConstraints.map((r) => r.reason).join('; ');
    } else {
        status = 'passed';
    }

    return {
        fieldKey: key,
        fieldType: config.type,
        editor: config.editor,
        status,
        receivedValue: value,
        receivedType: actualType,
        expectedType: config.type,
        constraintValidation: constraintResults.length > 0 ? constraintResults : undefined,
        reason,
    };
}

/**
 * Run tests for all fields in the configuration
 */
export function runAllTests(
    fieldConfigs: Record<string, FieldConfig>,
    input: Record<string, unknown>,
): TestResult[] {
    const results: TestResult[] = [];

    for (const [key, config] of Object.entries(fieldConfigs)) {
        const result = testField(key, config, input);
        results.push(result);
    }

    return results;
}

/**
 * Calculate test summary from results
 */
export function calculateSummary(results: TestResult[]): TestSummary {
    return {
        totalFields: results.length,
        passed: results.filter((r) => r.status === 'passed').length,
        failed: results.filter((r) => r.status === 'failed').length,
        skipped: results.filter((r) => r.status === 'skipped').length,
        timestamp: new Date().toISOString(),
    };
}
