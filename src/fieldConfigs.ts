import type { FieldConfig } from './types.js';

/**
 * String field configurations
 */
const STRING_FIELDS: Record<string, FieldConfig> = {
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
};

/**
 * Numeric field configurations (integers and floats)
 */
const NUMERIC_FIELDS: Record<string, FieldConfig> = {
    integerBasic: { type: 'integer', editor: 'number' },
    integerWithRange: {
        type: 'integer',
        editor: 'number',
        constraints: { minimum: 0, maximum: 100 },
    },
    numberBasic: { type: 'number', editor: 'number' },
    numberWithRange: {
        type: 'number',
        editor: 'number',
        constraints: { minimum: 0, maximum: 1 },
    },
};

/**
 * Boolean field configurations
 */
const BOOLEAN_FIELDS: Record<string, FieldConfig> = {
    booleanBasic: { type: 'boolean', editor: 'checkbox' },
    booleanGrouped1: { type: 'boolean', editor: 'checkbox' },
    booleanGrouped2: { type: 'boolean', editor: 'checkbox' },
};

/**
 * Object field configurations
 */
const OBJECT_FIELDS: Record<string, FieldConfig> = {
    objectJson: { type: 'object', editor: 'json' },
    objectJsonWithConstraints: {
        type: 'object',
        editor: 'json',
        constraints: { patternKey: '^[a-z]+$', minProperties: 1, maxProperties: 5 },
    },
    proxyConfiguration: { type: 'object', editor: 'proxy' },
    objectSchemaBased: { type: 'object', editor: 'schemaBased' },
    'object.with': { type: 'object', editor: 'json' },
};

/**
 * Array field configurations
 */
const ARRAY_FIELDS: Record<string, FieldConfig> = {
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
};

/**
 * Sub-schema (schemaBased) array configurations
 */
const SUB_SCHEMA_FIELDS: Record<string, FieldConfig> = {
    schemaBasedStringArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedIntegerArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedBooleanArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedObjectArray: { type: 'array', editor: 'schemaBased' },
    schemaBasedObjectArrayComplex: { type: 'array', editor: 'schemaBased' },
};

/**
 * Resource picker field configurations
 */
const RESOURCE_FIELDS: Record<string, FieldConfig> = {
    resourceDataset: { type: 'string', editor: 'resourcePicker' },
    resourceKeyValueStore: { type: 'string', editor: 'resourcePicker' },
};

/**
 * Special feature field configurations
 */
const SPECIAL_FIELDS: Record<string, FieldConfig> = {
    nullableString: { type: 'string', editor: 'textfield' },
    fieldWithExample: { type: 'string', editor: 'textfield' },
    fieldWithErrorMessage: {
        type: 'string',
        editor: 'textfield',
        constraints: { pattern: '^[A-Z]+$', minLength: 2 },
    },
    requiredField: { type: 'string', editor: 'textfield', required: true },
};

/**
 * All field configurations combined
 */
export const FIELD_CONFIGS: Record<string, FieldConfig> = {
    ...STRING_FIELDS,
    ...NUMERIC_FIELDS,
    ...BOOLEAN_FIELDS,
    ...OBJECT_FIELDS,
    ...ARRAY_FIELDS,
    ...SUB_SCHEMA_FIELDS,
    ...RESOURCE_FIELDS,
    ...SPECIAL_FIELDS,
};
