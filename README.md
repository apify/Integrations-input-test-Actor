# Input Schema Test Actor

A comprehensive test Actor for validating all Apify input schema field types and editors. This Actor serves as a reference implementation and testing ground for the Apify platform's input schema capabilities.

## Features

- **[Apify SDK](https://docs.apify.com/sdk/js/)** - Toolkit for building Actors
- **[Crawlee](https://crawlee.dev/)** - Web scraping and browser automation library

## Input Schema Reference

The input schema is organized into logical sections. Each section tests different field types and editor configurations. The individual schema files are located in `.actor/input_schemas/`.

<details>
<summary><strong>📝 String Fields</strong></summary>

Testing all string type editors and variations.

| Field | Editor | Description |
|-------|--------|-------------|
| `stringTextfield` | `textfield` | Basic string input with textfield editor |
| `stringTextfieldWithPattern` | `textfield` | String with regex pattern validation (alphanumeric only, 3-20 chars) |
| `stringTextarea` | `textarea` | Multi-line text input |
| `stringJavascript` | `javascript` | JavaScript code editor with syntax highlighting |
| `stringPython` | `python` | Python code editor with syntax highlighting |
| `stringSelectEnum` | `select` | Dropdown select with fixed enum values |
| `stringSelectSuggested` | `select` | Dropdown with suggested values but allows custom input |
| `stringDateAbsolute` | `datepicker` | Date picker for absolute dates only |
| `stringDateRelative` | `datepicker` | Date picker for relative dates only (e.g., '7 days ago') |
| `stringDateAbsoluteOrRelative` | `datepicker` | Date picker allowing both absolute and relative dates |
| `stringFileupload` | `fileupload` | Upload a single file (string type) |
| `stringSecret` | `textfield` | Secret string input (masked in UI, `isSecret: true`) |

📁 Schema file: [.actor/input_schemas/string_fields.json](.actor/input_schemas/string_fields.json)

</details>

<details>
<summary><strong>🔢 Numeric Fields</strong></summary>

Testing integer and number (float) types.

| Field | Type | Description |
|-------|------|-------------|
| `integerBasic` | `integer` | Basic integer input |
| `integerWithRange` | `integer` | Integer with min/max constraints and unit |
| `numberBasic` | `number` | Basic floating point number |
| `numberWithRange` | `number` | Float with min/max constraints and unit |

📁 Schema file: [.actor/input_schemas/numeric_fields.json](.actor/input_schemas/numeric_fields.json)

</details>

<details>
<summary><strong>☑️ Boolean Fields</strong></summary>

Testing checkbox and grouped boolean options.

| Field | Description |
|-------|-------------|
| `booleanBasic` | Basic checkbox |
| `booleanGrouped1` | First option in grouped checkboxes (Feature Toggles group) |
| `booleanGrouped2` | Second option in grouped checkboxes (Feature Toggles group) |

📁 Schema file: [.actor/input_schemas/boolean_fields.json](.actor/input_schemas/boolean_fields.json)

</details>

<details>
<summary><strong>📦 Object Fields</strong></summary>

Testing object type with various editors.

| Field | Editor | Description |
|-------|--------|-------------|
| `objectJson` | `json` | Basic JSON object input |
| `objectJsonWithConstraints` | `json` | Object with patternKey, patternValue, and property count constraints |
| `proxyConfiguration` | `proxy` | Apify proxy settings |
| `objectSchemaBased` | `schemaBased` | Object with sub-properties rendered individually |
| `object.with` | `json` | Testing object key with dot character |

📁 Schema file: [.actor/input_schemas/object_fields.json](.actor/input_schemas/object_fields.json)

</details>

<details>
<summary><strong>📋 Array Fields</strong></summary>

Testing array type with various editors.

| Field | Editor | Description |
|-------|--------|-------------|
| `arrayJson` | `json` | Basic array with JSON editor |
| `arrayRequestListSources` | `requestListSources` | URLs in Crawlee RequestListSources format |
| `arrayPseudoUrls` | `pseudoUrls` | PseudoUrl patterns for crawling |
| `arrayGlobs` | `globs` | GlobInput patterns |
| `arrayKeyValue` | `keyValue` | Array of key-value pairs |
| `arrayStringList` | `stringList` | Simple list of strings |
| `arrayFileupload` | `fileupload` | Upload multiple files |
| `arraySelectMulti` | `select` | Multi-select dropdown with fixed options |
| `arraySelectSuggested` | `select` | Multi-select with suggested values and custom input |

📁 Schema file: [.actor/input_schemas/array_fields.json](.actor/input_schemas/array_fields.json)

</details>

<details>
<summary><strong>🔧 Sub-Schema Fields</strong></summary>

Testing schemaBased editor with various item types.

| Field | Items Type | Description |
|-------|------------|-------------|
| `schemaBasedStringArray` | `string` | Array of strings with schema-based editor |
| `schemaBasedIntegerArray` | `integer` | Array of integers with schema-based editor |
| `schemaBasedBooleanArray` | `boolean` | Array of booleans with schema-based editor |
| `schemaBasedObjectArray` | `object` | Array of objects with sub-schema (firstName, lastName, age) |
| `schemaBasedObjectArrayComplex` | `object` | Array of objects with multiple field types |

📁 Schema file: [.actor/input_schemas/sub_schema_fields.json](.actor/input_schemas/sub_schema_fields.json)

</details>

<details>
<summary><strong>🗂️ Resource Fields</strong></summary>

Testing resource picker for datasets and key-value stores.

| Field | Resource Type | Permissions |
|-------|---------------|-------------|
| `resourceDataset` | `dataset` | READ |
| `resourceKeyValueStore` | `keyValueStore` | READ, WRITE |

📁 Schema file: [.actor/input_schemas/resource_fields.json](.actor/input_schemas/resource_fields.json)

</details>

<details>
<summary><strong>⚡ Special Features</strong></summary>

Testing nullable, example, errorMessage, and required fields.

| Field | Feature | Description |
|-------|---------|-------------|
| `nullableString` | `nullable: true` | String field that can be null |
| `fieldWithExample` | `example` | String field showing example property |
| `fieldWithErrorMessage` | `errorMessage` | String with custom error messages for validation |
| `requiredField` | `required` | This field is required |

📁 Schema file: [.actor/input_schemas/special_features.json](.actor/input_schemas/special_features.json)

</details>

## Project Structure

```
.actor/
├── actor.json              # Actor config: name, version, runtime settings
├── input_schema.json       # Main input validation & Console form definition
├── input_schemas/          # Organized input schema sections
│   ├── string_fields.json
│   ├── numeric_fields.json
│   ├── boolean_fields.json
│   ├── object_fields.json
│   ├── array_fields.json
│   ├── sub_schema_fields.json
│   ├── resource_fields.json
│   └── special_features.json
└── dataset_schema.json     # Output schema definition
src/
└── main.ts                 # Actor entry point
storage/                    # Local storage (mirrors Cloud during development)
├── datasets/
├── key_value_stores/
└── request_queues/
```

## Getting Started

Run the Actor locally:

```bash
apify run
```

For complete information, see the [Apify development documentation](https://docs.apify.com/platform/actors/development#build-actor-locally).

## Deploy to Apify

### Connect Git repository to Apify

1. Go to [Actor creation page](https://console.apify.com/actors/new)
2. Click on **Link Git Repository** button

### Push from local machine

1. Log in to Apify:
    ```bash
    apify login
    ```

2. Deploy your Actor:
    ```bash
    apify push
    ```

## Documentation

- [Apify SDK for JavaScript](https://docs.apify.com/sdk/js)
- [Apify Platform documentation](https://docs.apify.com/platform)
- [Crawlee documentation](https://crawlee.dev)
- [Join our developer community on Discord](https://discord.com/invite/jyEM2PRvMU)
