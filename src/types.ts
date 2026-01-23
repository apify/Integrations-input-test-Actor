/**
 * Field configuration interface for defining expected input fields
 */
export interface FieldConfig {
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

/**
 * Constraint validation result
 */
export interface ConstraintValidationResult {
    constraint: string;
    valid: boolean;
    reason?: string;
}

/**
 * Test result for a single field
 */
export interface TestResult {
    fieldKey: string;
    fieldType: string;
    editor: string;
    status: 'passed' | 'failed' | 'skipped';
    receivedValue?: unknown;
    receivedType: string;
    expectedType: string;
    constraintValidation?: ConstraintValidationResult[];
    reason?: string;
}

/**
 * Test summary containing aggregate results
 */
export interface TestSummary {
    totalFields: number;
    passed: number;
    failed: number;
    skipped: number;
    timestamp: string;
    error?: string;
}

/**
 * Full test report with summary and individual results
 */
export interface TestReport {
    summary: TestSummary;
    results: TestResult[];
}
