import { Actor, log } from 'apify';

// Field configuration interface
interface FieldConfig {
    type: 'string' | 'integer' | 'number' | 'boolean' | 'object' | 'array';
    editor: string;
    required?: boolean;
    constraints?: {
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        minimum?: number;
        maximum?: number;
        minItems?: number;
        maxItems?: number;
        minProperties?: number;
        maxProperties?: number;
        patternKey?: string;
        patternValue?: string;
    };
}

// Test result interface
interface TestResult {
    fieldKey: string;
    fieldType: string;
    editor: string;
    status: 'passed' | 'failed' | 'skipped';
    receivedValue?: unknown;
    receivedType: string;
    expectedType: string;
    constraintValidation?: {
        constraint: string;
        valid: boolean;
        reason?: string;
    }[];
    reason?: string;
}

// Define all expected fields with their configurations
const FIELD_CONFIGS: Record<string, FieldConfig> = {
    // String fields
    stringTextfield: { type: 'string', editor: 'textfield' },
    stringTextfieldWithPattern: {
        type: 'string',
        editor: 'textfield',
        constraints: { pattern: '^[a-zA-Z0-9]+$', minLength: 3, maxLength: 20 },
    },
    stringTextarea: { type: 'string', editor: 'textarea' },
    stringJavascript: { type: 'string', editor: 'javascript' },
    stringPython: { type: 'string', editor: 'python' },
    stringSelectEnum: { type: 'string', editor: 'select' },
    stringSelectSuggested: { type: 'string', editor: 'select' },
    stringDateAbsolute: { type: 'string', editor: 'datepicker' },
    stringDateRelative: { type: 'string', editor: 'datepicker' },
    stringDateAbsoluteOrRelative: { type: 'string', editor: 'datepicker' },
    stringFileupload: { type: 'string', editor: 'fileupload' },
    stringSecret: { type: 'string', editor: 'textfield' },

    // Integer fields
    integerBasic: { type: 'integer', editor: 'number' },
    integerWithRange: {
        type: 'integer',
        editor: 'number',
        constraints: { minimum: 0, maximum: 100 },
    },

    // Number (float) fields
    numberBasic: { type: 'number', editor: 'number' },
    numberWithRange: {
        type: 'number',
        editor: 'number',
        constraints: { minimum: 0, maximum: 1 },
    },

    // Boolean fields
    booleanBasic: { type: 'boolean', editor: 'checkbox' },
    booleanGrouped1: { type: 'boolean', editor: 'checkbox' },
    booleanGrouped2: { type: 'boolean', editor: 'checkbox' },

    // Object fields
    objectJson: { type: 'object', editor: 'json' },
    objectJsonWithConstraints: {
        type: 'object',
        editor: 'json',
        constraints: { patternKey: '^[a-z]+$', minProperties: 1, maxProperties: 5 },
    },
    proxyConfiguration: { type: 'object', editor: 'proxy' },
    objectSchemaBased: { type: 'object', editor: 'schemaBased' },
    'object.with': { type: 'object', editor: 'json' },

    // Array fields
    arrayJson: {
        type: 'array',
        editor: 'json',
        constraints: { minItems: 1, maxItems: 10 },
    },
    arrayRequestListSources: { type: 'array', editor: 'requestListSources' },
    arrayPseudoUrls: { type: 'array', editor: 'pseudoUrls' },
    arrayGlobs: { type: 'array', editor: 'globs' },
    arrayKeyValue: { type: 'array', editor: 'keyValue' },
    arrayStringList: { type: 'array', editor: 'stringList' },
    arrayFileupload: { type: 'array', editor: 'fileupload' },
    arraySelectMulti: { type: 'array', editor: 'select' },
    arraySelectSuggested: { type: 'array', editor: 'select' },

    // Sub-schema (schemaBased) arrays
    schemaBasedStringArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedIntegerArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedBooleanArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedObjectArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedObjectArrayComplex: { type: 'array', editor: 'schemaBased' },

    // Resource fields
    resourceDataset: { type: 'string', editor: 'resourcePicker' },
    resourceKeyValueStore: { type: 'string', editor: 'resourcePicker' },

    // Special fields
    nullableString: { type: 'string', editor: 'textfield' },
    fieldWithExample: { type: 'string', editor: 'textfield' },
    fieldWithErrorMessage: {
        type: 'string',
        editor: 'textfield',
        constraints: { pattern: '^[A-Z]+$', minLength: 2 },
    },
    requiredField: { type: 'string', editor: 'textfield', required: true },
};

// Get the actual JavaScript type of a value
function getActualType(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

// Check if type matches expected
function validateType(value: unknown, expectedType: string): boolean {
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

// Validate constraints and return detailed results
function validateConstraints(
    value: unknown,
    constraints: FieldConfig['constraints'],
    fieldType: string,
): { constraint: string; valid: boolean; reason?: string }[] {
    const results: { constraint: string; valid: boolean; reason?: string }[] = [];

    if (!constraints) return results;

    // String constraints
    if (fieldType === 'string' && typeof value === 'string') {
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
    }

    // Number constraints
    if ((fieldType === 'integer' || fieldType === 'number') && typeof value === 'number') {
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
    }

    // Array constraints
    if (fieldType === 'array' && Array.isArray(value)) {
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
    }

    // Object constraints
    if (fieldType === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
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
    }

    return results;
}

// Test a single field
function testField(key: string, config: FieldConfig, input: Record<string, unknown>): TestResult {
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

// Initialize Actor
await Actor.init();

log.info('Starting Input Schema Test Actor');
log.info('This Actor validates all input schema field types and editors');

// Get input
const rawInput = (await Actor.getInput()) as Record<string, unknown> | null;

if (!rawInput) {
    log.error('No input provided');
    await Actor.pushData({
        totalFields: Object.keys(FIELD_CONFIGS).length,
        passed: 0,
        failed: Object.keys(FIELD_CONFIGS).length,
        skipped: 0,
        timestamp: new Date().toISOString(),
        error: 'No input provided',
    });
    await Actor.exit();
    throw new Error('No input provided'); // Unreachable, but satisfies TypeScript
}

const input: Record<string, unknown> = rawInput;

log.info(`Received input with ${Object.keys(input).length} fields`);
log.info(`Testing ${Object.keys(FIELD_CONFIGS).length} expected fields`);

// Test all fields
const results: TestResult[] = [];
for (const [key, config] of Object.entries(FIELD_CONFIGS)) {
    const result = testField(key, config, input);
    results.push(result);

    // Log each result
    if (result.status === 'passed') {
        log.info(`[PASS] ${key} (${config.type}/${config.editor})`);
    } else if (result.status === 'failed') {
        log.warning(`[FAIL] ${key}: ${result.reason}`);
    } else {
        log.debug(`[SKIP] ${key}: ${result.reason}`);
    }
}

// Calculate summary
const passed = results.filter((r) => r.status === 'passed').length;
const failed = results.filter((r) => r.status === 'failed').length;
const skipped = results.filter((r) => r.status === 'skipped').length;

// Log summary
log.info('========================================');
log.info('TEST SUMMARY');
log.info('========================================');
log.info(`Total Fields: ${results.length}`);
log.info(`Passed: ${passed}`);
log.info(`Failed: ${failed}`);
log.info(`Skipped: ${skipped}`);
log.info('========================================');

// Log failed fields details
if (failed > 0) {
    log.warning('Failed fields:');
    for (const result of results.filter((r) => r.status === 'failed')) {
        log.warning(`  - ${result.fieldKey}: ${result.reason}`);
    }
}

// Push summary to dataset
await Actor.pushData({
    totalFields: results.length,
    passed,
    failed,
    skipped,
    timestamp: new Date().toISOString(),
});

// Push individual results to dataset
for (const result of results) {
    await Actor.pushData(result);
}

// Save full report to key-value store
await Actor.setValue('TEST_REPORT', {
    summary: {
        totalFields: results.length,
        passed,
        failed,
        skipped,
        timestamp: new Date().toISOString(),
    },
    results,
});

log.info('Test report saved to key-value store as TEST_REPORT');

// Exit gracefully
await Actor.exit();
