import { Actor, log } from 'apify';

import { FIELD_CONFIGS } from './fieldConfigs.js';
import { calculateSummary, runAllTests } from './testRunner.js';
import type { TestReport, TestResult } from './types.js';

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
    throw new Error('No input provided');
}

const input: Record<string, unknown> = rawInput;

log.info(`Received input with ${Object.keys(input).length} fields`);
log.info(`Testing ${Object.keys(FIELD_CONFIGS).length} expected fields`);

// Run all tests
const results: TestResult[] = runAllTests(FIELD_CONFIGS, input);

// Log each result
for (const result of results) {
    if (result.status === 'passed') {
        log.info(`[PASS] ${result.fieldKey} (${result.fieldType}/${result.editor})`);
    } else if (result.status === 'failed') {
        log.warning(`[FAIL] ${result.fieldKey}: ${result.reason}`);
    } else {
        log.debug(`[SKIP] ${result.fieldKey}: ${result.reason}`);
    }
}

// Calculate summary
const summary = calculateSummary(results);

// Log summary
log.info('========================================');
log.info('TEST SUMMARY');
log.info('========================================');
log.info(`Total Fields: ${summary.totalFields}`);
log.info(`Passed: ${summary.passed}`);
log.info(`Failed: ${summary.failed}`);
log.info(`Skipped: ${summary.skipped}`);
log.info('========================================');

// Log failed fields details
if (summary.failed > 0) {
    log.warning('Failed fields:');
    for (const result of results.filter((r) => r.status === 'failed')) {
        log.warning(`  - ${result.fieldKey}: ${result.reason}`);
    }
}

// Push summary to dataset
await Actor.pushData(summary);

// Push individual results to dataset
for (const result of results) {
    await Actor.pushData(result);
}

// Save full report to key-value store
const report: TestReport = {
    summary,
    results,
};
await Actor.setValue('TEST_REPORT', report);

log.info('Test report saved to key-value store as TEST_REPORT');

// Exit gracefully
await Actor.exit();
